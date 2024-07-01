const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).send('Email or password is wrong');

    const user = rows[0];
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).send('Email or password is wrong');

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const [accessRows] = await pool.query('SELECT * FROM access WHERE email = ?', [email]);
    res.header('Authorization', token).send({ token, access: accessRows[0].value });
};

// exports.register = async (req, res) => {
//     const { email, password, name, surname, profileImage, gender } = req.body;
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     try {
//         await pool.query('INSERT INTO user (email, password, name, surname, profileImage, gender) VALUES (?, ?, ?, ?, ?, ?)', [email, hashedPassword, name, surname, profileImage, gender]);
//         res.send('User registered successfully');
//     } catch (err) {
//         res.status(400).send(err);
//     }
// };


exports.register = async (req, res) => {
    const { email, password, name, surname, profileImage, gender, interest, organization = 'acchemarks', access_keys } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // Insert the user into the user table
        await connection.query(
            'INSERT INTO user (email, password, name, surname, profileImage, gender, interest, organization) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [email, hashedPassword, name, surname, profileImage, gender, interest, organization]
        );

        // Insert the access keys into the user_access table
        if (access_keys && access_keys.length > 0) {
            for (const access_key of access_keys) {
                await connection.query(
                    'INSERT INTO user_access (user_email, access_key) VALUES (?, ?)',
                    [email, access_key]
                );
            }
        }

        await connection.commit();
        res.send('User registered successfully');
    } catch (err) {
        await connection.rollback();
        res.status(400).send(err);
    } finally {
        connection.release();
    }
};

exports.refresh = async (req, res) => {
    const { oldtoken, email, password } = req.body;

    try {
        jwt.verify(oldtoken, process.env.JWT_SECRET);
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const [accessRows] = await pool.query('SELECT * FROM access WHERE email = ?', [email]);
        res.header('Authorization', token).send({ token, access: accessRows[0].value });
    } catch (err) {
        res.status(400).send('Invalid old token');
    }
};

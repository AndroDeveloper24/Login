const pool = require('../config/db');

exports.getUserDetails = async (req, res) => {
    const { email } = req.body;

    const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).send('User not found');

    res.send(rows[0]);
};

exports.updateUserDetails = async (req, res) => {
    const { updatedata } = req.body;
    const { email } = req.user;

    try {
        await pool.query('UPDATE user SET ? WHERE email = ?', [updatedata, email]);
        res.send('User updated successfully');
    } catch (err) {
        res.status(400).send(err);
    }
};

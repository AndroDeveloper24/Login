const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Access Denied');
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        const [rows] = await pool.query('SELECT * FROM access WHERE email = ?', [verified.email]);
        if (rows.length === 0) {
            return res.status(403).send('No access rights');
        }
        req.access = rows[0].value;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');

const generateToken = (userId) => {
    return jwt.sign({userId}, secretKey, { expiresIn: '1h' });
}

module.exports = { generateToken };
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config');

const generateToken = (user) => {
    return jwt.sign({ username: user.username, id: user._id}, JWT_SECRET, {expiresIn: '7d'});
};

module.exports = generateToken;
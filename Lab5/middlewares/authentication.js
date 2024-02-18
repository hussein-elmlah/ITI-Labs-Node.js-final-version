const User = require('../models/User');
const jwt = require("jsonwebtoken");
const util = require("util");
const { JWT_SECRET } = require('../config');

// Promisify jwt.verify function
const verifyAsync = util.promisify(jwt.verify);

const authenticateUser = async (req, res, next) => {
  try {
    const { authorization: token } = req.headers;

    // Check if authorization header is present
    if (!token) {
      return res.status(401).json({ error: "UN_Authenticated" });
    }

    // Verify token
    const decodedToken = await verifyAsync(token, JWT_SECRET);

    // Find user by decoded token's ID
    const user = await User.findById(decodedToken.id).exec();

    // Handle user not found
    if (!user) {
      return res.status(401).json({ error: "Token's user not found" });
    }

    // Attach user object to request
    req.user = user;
    next(); // Call the next middleware function

  } catch (error) {
    // Handle errors
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: "Invalid token" });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = {
    authenticateUser
}

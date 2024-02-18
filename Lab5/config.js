require('dotenv').config();

const { JWT_SECRET = 'local_JWT_Secret_test123', PORT, MONGODB_URI } = process.env;

module.exports = {
    JWT_SECRET,
    PORT: parseInt(PORT, 10) || 3000, // Parse PORT as integer, default to 3000 if not defined
    MONGODB_URI: MONGODB_URI || "mongodb://localhost:27017/todosDB"
};

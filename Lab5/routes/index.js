const router = require('express').Router();

router.use('/todos', require('./todos'));
router.use('/users', require('./users'));
const dotenv = require('dotenv');

dotenv.config();

module.exports = router;

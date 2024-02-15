const router = require('express').Router();

router.use('/todos', require('./todos'));
router.use('/users', require('./users'));

module.exports = router;

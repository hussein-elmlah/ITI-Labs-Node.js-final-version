/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UsersController } = require('../controllers');
const asyncWrapper = require('../lib/async-wrapper');
const CustomError = require('../lib/customError');

router.post('/', async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.create(req.body));
  if (!err) {
    return res.json(user.token);
  }
  return next(err);
});
router.post('/login', async (req, res, next) => {
  const { userName, password } = req.body;
  const [err, user] = await asyncWrapper(UsersController.login(userName, password));
  if (!user) {
    return next(new CustomError('UN_AUTH', 401));
  }
  return res.json({
    userDetails: user,
    token: user.token,
  });
});

router.get('/', async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.getAllTodos());
  if (!err) {
    return res.json(user);
  }
  return next(err);
});
router.get('/:id', async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.getTodo(req.params.id));
  if (!err) {
    return res.json(user);
  }
  return next(err);
});

router.get('/:id/todos', async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.getTodosForUser(req.params.id));
  if (!err) {
    return res.json(user);
  }
  return next(err);
});

router.delete('/:id', async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.deleteUser(req.params.id));
  if (!err) {
    return res.json(user);
  }
  return next(err);
});

router.patch('/:id', async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.updateUser(req.params.id, req.body));
  if (!err) {
    return res.json(user);
  }
  return next(err);
});

module.exports = router;

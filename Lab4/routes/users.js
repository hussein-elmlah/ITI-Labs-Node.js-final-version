const router = require('express').Router();
const { UsersController } = require('../controllers');
const asyncWrapper = require('../lib/async-wrapper');

router.post('/', async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.create(req.body));
  if (!err) {
    return res.json(user);
  }
  return next(err);
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

router.patch('/:id',async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.updateUser(req.params.id, req.body));
  if (!err) {
    return res.json(user);
  }
  return next(err);
});
module.exports = router;

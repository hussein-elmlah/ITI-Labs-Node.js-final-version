const router = require('express').Router();
const { TodosController } = require('../controllers');
const asyncWrapper = require('../lib/async-wrapper');
const authorization = require('../controllers/authorization');

router.use(authorization.validateUser);

router.get('/', async (req, res, next) => {
  const [err, todos] = await asyncWrapper(TodosController.find(req.query, req.user));
  if (!err) {
    return res.json(todos);
  }
  return next(err);
});

router.post('/', async (req, res, next) => {
  req.body.userId = req.user;
  const [err, todo] = await asyncWrapper(TodosController.create(req.body));
  if (!err) {
    return res.json(todo);
  }
  return next(err);
});

router.patch('/:id', async (req, res, next) => {
  // eslint-disable-next-line max-len
  const [err, todo] = await asyncWrapper(TodosController.updateTodo(req.params.id, req.body, req.user));
  if (!err) {
    return res.json(todo);
  }
  return next(err);
});

router.delete('/:id', async (req, res, next) => {
  const [err, todo] = await asyncWrapper(TodosController.deleteTodo(req.params.id));
  if (!err) {
    return res.json(todo);
  }
  return next(err);
});

module.exports = router;

const router = require('express').Router();
const { TodosController, UsersController } = require('../controllers');
const asyncWrapper = require('../lib/async-wrapper');

router.get('/', async (req, res) => {
  const todos = await TodosController.find(req.query);
  res.json(todos);
});

router.post('/', async (req, res, next) => {
  const [err, todo] = await asyncWrapper(TodosController.create(req.body));
  if (!err) {
    return res.json(todo);
  }
  return next(err);
});

router.patch('/:id', async (req, res, next) => {
  const [err, todo] = await asyncWrapper(TodosController.updateTodo(req.params.id, req.body));
  if (!err) {
    return res.json(todo);
  }
  return next(err);
});

router.delete('/:id', async (req, res) => {
  const [err, todo] = await asyncWrapper(TodosController.deleteTodo(req.params.id));
  if (!err) {
    return res.json(todo);
  }
  return next(err);
});
///todos?limit=10&skip=0&status=$value
router.get('/', async (req, res) => {
  const todos = await TodosController.find();
  res.json(todos);
});

module.exports = router;

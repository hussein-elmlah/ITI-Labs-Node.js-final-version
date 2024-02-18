// routes/todoRoutes.js
const express = require("express");
const router = express.Router();
const TodosController = require("../controllers/todosController");
const asyncWrapper = require("../lib/async-wrapper");
const {authenticateUser} = require("../middlewares/authentication");
const { checkRole, authorizeTodoAccess } = require('../middlewares/authorization');

router.post("/", authenticateUser, async (req, res, next) => {
  req.body.userId = req.user._id;
  const [err, todo] = await asyncWrapper(
    TodosController.createTodo(req.body)
  );
  if (err) {
    return next(err);
  }
  res.status(201).json(todo);
});

router.patch("/:id", authenticateUser, authorizeTodoAccess, async (req, res, next) => {
  const [err, todo] = await asyncWrapper(
    TodosController.updateTodo(req.params.id, req.body)
  );
  if (err) {
    return next(err);
  }
  res.json({ todo });
});

router.delete("/:id", authenticateUser, authorizeTodoAccess, async (req, res, next) => {
  const [err] = await asyncWrapper(TodosController.deleteTodo(req.params.id));
  if (err) {
    return next(err);
  }
  res.sendStatus(204);
});

router.get("/", authenticateUser, checkRole('admin'), async (req, res, next) => {
  const { limit, skip, status} = req.query;
  const [err, todos] = await asyncWrapper(
    TodosController.getTodosWithFilters(limit, skip, status)
  );
  if (err) {
    return next(err);
  }
  res.json(todos);
});

module.exports = router;

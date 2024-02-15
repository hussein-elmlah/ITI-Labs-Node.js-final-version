const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const todosController = require("../controllers/todosController");

// Middleware to validate inputs
const validateTodoInput = (req, res, next) => {
  if (!req.body.title) {
    return res.status(400).send("Title is required");
  }
  next();
};

// Routes
router.get("/", todosController.getFilteredTodos); // Get todos by status and/or title or all todos
router.get("/:id", todosController.getTodoById);
router.post("/", validateTodoInput, todosController.createTodo);
router.delete("/:id", todosController.deleteTodoById);
router.patch("/:id", validateTodoInput, todosController.updateTodoById);

// Export router
module.exports = router;

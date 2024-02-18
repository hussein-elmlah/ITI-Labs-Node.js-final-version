const CustomError = require("../lib/customError");
const Todo = require("../models/Todo");

const authorizeTodoAccess = async (req, res, next) => {
  const userId = req.user.id;
  const todoId = req.params.id;

  if (!userId || !todoId) {
    return next(new CustomError("Unauthorized access", 403));
  }

  const todo = await Todo.findById(todoId);
  if (!todo) {
    return next(new CustomError("Todo not found", 404));
  }

  if (todo.userId.toString() !== userId) {
    return next(new CustomError("Unauthorized access", 403));
  }

  next();
};

const authorizeUser = async (req, res, next) => {
  const userId = req.user.id;
  const requestedUserId = req.params.userId;
  if (!userId ||!requestedUserId) {
    return next(new CustomError("Unauthorized access", 403));
  }

  if (userId !== requestedUserId) {
    return next(new CustomError("Unauthorized access", 403));
  }

  next();
};

const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      next(new CustomError('Forbidden', 403));
    }
  };
};

const authorizeUserOrAdmin = async (req, res, next) => {
  const userId = req.user.id;
  const requestedUserId = req.params.id;
  if (userId !== requestedUserId && req.user.role !== 'admin') {
    return next(new CustomError("Unauthorized access", 403));
  }

  next();
};

module.exports = { authorizeTodoAccess, authorizeUser, checkRole, authorizeUserOrAdmin };

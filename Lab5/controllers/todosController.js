const Todo = require("../models/Todo");
const mongoose = require("mongoose");
const CustomError = require("../lib/customError");

exports.createTodo = async ({ userId, title , status="to-do", tags}) => {
  try {
    const todo = await Todo.create({ userId, title , status, tags})
    return todo;
  } catch (error) {
    throw new CustomError(`Failed to create todo: ${error.message}`, error.status);
  }
};

exports.updateTodo = async (id, {title , status, tags}) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid id format', 400); // Bad Request
    }

    const todo = await Todo.findByIdAndUpdate(id, {title , status, tags}, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      throw new CustomError("Todo not found", 404);
    }
    return todo;
  } catch (error) {
      throw new CustomError(`Failed to update todo: ${error.message}`, error.status);
  }
};

exports.deleteTodo = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid id format', 400); // Bad Request
    }
    
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      throw new CustomError("Todo not found", 404);
    }
  } catch (error) {
      throw new CustomError(`Failed to delete todo: ${error.message}`, error.status);
  }
};

exports.getTodosWithFilters = async (limit = 10, skip = 0, status) => {
    if (skip < 0) {
        skip = 0;
    }
    if (limit < 0 || limit > 10) {
        limit = 10;
    }
  try {
    const query = {};
    if (status) {
      query.status = status;
    }
    const todos = await Todo.find(query).limit(limit).skip(skip);
    return todos;
  } catch (error) {
    throw new CustomError(`Failed to fetch todos: ${error.message}`, error.status);
  }
};
  
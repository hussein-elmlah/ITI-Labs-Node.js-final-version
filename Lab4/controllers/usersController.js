const mongoose = require('mongoose');
const User = require('../models/User');
const Todo = require('../models/Todo');
const CustomError = require('../lib/customError');

exports.createUser = async (body) => {
  try {
    const user = await User.create(body);
    return user;
  } catch (error) {
    throw new CustomError(`Failed to create user: ${error.message}`, 500);
  }
};

exports.getUsersFirstName = async () => {
  try {
    const users = await User.find({}, 'firstName');
    return users;
  } catch (error) {
    throw new CustomError(`Failed to get users: ${error.message}`, 500);
  }
};

exports.deleteUser = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid id format', 400);
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
  } catch (error) {
    throw new CustomError(`Failed to delete user: ${error.message}`, error.status || 500);
  }
};

exports.updateUser = async (id, body) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid id format', 400);
    }
    const user = await User.findByIdAndUpdate(id, body, { new: true });
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    return user;
  } catch (error) {
    throw new CustomError(`Failed to update user: ${error.message}`, error.status || 500);
  }
};

exports.getTodosByUserId = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new CustomError('Invalid id format', 400);
    }
    const todos = await Todo.find({ userId });
    return todos;
  } catch (error) {
    throw new CustomError(`Failed to fetch todos: ${error.message}`, error.status || 500);
  }
};

const mongoose = require('mongoose');
const User = require('../models/User');
const Todo = require('../models/Todo');
const CustomError = require('../lib/customError');
const generateToken = require('../utils/jwtUtils');


exports.createUser = async ({username, firstName, lastName, dob, password}) => {
  try {
    const user = await User.create({username, firstName, lastName, dob, password});
    return user;
  } catch (error) {
    throw new CustomError(`Failed to create user: ${error.message}`, 500);
  }
};

exports.loginUser = async ({ username, password }) => {
  try {
    const user = await User.findOne({ username }).exec();
    if (!user) {
      throw new CustomError('UN_Authenticated', 401);
    }
    const valid = user.verifyPassword(password);
    if (!valid) {
      throw new CustomError('UN_Authenticated', 401);
    }
    const token = generateToken(user);
    return token;
  } catch (error) {
    throw new CustomError(`Failed to login user: ${error.message}`, error.status || 500);
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

exports.updateUser = async (id, {username, firstName, lastName, dob, password}) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid id format', 400);
    }
    const user = await User.findByIdAndUpdate(id, {username, firstName, lastName, dob, password}, { new: true });
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

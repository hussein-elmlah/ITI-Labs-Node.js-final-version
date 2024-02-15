const Users = require('../models/users');
const Todos = require('../models/todos');
const CustomError =require('../lib/customError')

const create = async (input) => {
  const user = await Users.create(input)
  .catch((err) => {
    throw new CustomError(err.message, 422);
  });
  return user;
};
const getTodo = async (query) => {
  const user = await Users.findOne({_id: query})
  .catch((err) => {
    throw new CustomError(err.message, 422);
  });
  return user;
};
const getAllTodos = async () =>{
  const users = await Users.find().select({_id:0 ,firstName:1 })
  .catch((err) => {
    throw new CustomError(err.message, 422);
  });
  return users;
};
const deleteUser = async (id) => {
  const acknowledge = await Users.deleteOne({_id: id})
  .catch((err) => {
    throw new CustomError(err.message, 422);
  });
  return acknowledge;
};
const updateUser = async (id,body) => {
  const user = await Users.findOneAndUpdate({ _id: id },body,{ new: true, runValidators: true })
  .catch((err) => {
    throw new CustomError(err.message, 422);
  });
  return user;
}
const getTodosForUser = async (query) => {
  const todos = await Todos.find({userId: query})
  .catch((err) => {
    throw new CustomError(err.message, 422);
  });
  return todos;
}

module.exports = {
  create,
  getAllTodos,
  getTodosForUser,
  deleteUser,
  updateUser,
  getTodo,
};

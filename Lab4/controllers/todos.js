const Todos = require('../models/todos');
const CustomError =require('../lib/customError')

const find = async (query) => {
  if(!query.status){
    const todos = await Todos.find().limit(query.limit).skip(query.skip).populate('userId').exec().catch((err) => {
      throw new CustomError(err.message, 422);
    });
    return todos;
  }
  const todos = await Todos.find({ status: query.status}).limit(query.limit).skip(query.skip).populate('userId').exec().catch((err) => {
    throw new CustomError(err.message, 422);
  });
  return todos;
};

const create = async (todo) => {
  const newTodo = await Todos.create(todo)
    .catch((err) => {
      throw new CustomError(err.message, 422);
    });
  return newTodo;
};

const updateTodo = async (id,body) => {
  const todo = await Todos.findOneAndUpdate({ _id: id },body,{ new: true, runValidators: true })
  .catch((err) => {
    throw new CustomError(err.message, 422);
  });
  return todo ;
};

const deleteTodo = async (id) => {
  const acknowledge = await Todos.deleteOne({_id: id})
  .catch((err) => {
    throw new CustomError(err.message, 422);
  });
  return acknowledge;
};

module.exports = {
  create,
  find,
  updateTodo,
  deleteTodo,
};

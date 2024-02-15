// todoOperations.js
const { saveNextTodoId, readTodos, saveTodos } = require("./database");
let { nextTodoId } = require("./database");

function addTodoTask(title) {
  const todos = readTodos();
  console.log(todos);
  const newTask = {
    id: ++nextTodoId,
    title,
    status: "to-do",
  };

  todos.push(newTask);
  saveTodos(todos); // Save the updated todo list
  saveNextTodoId(nextTodoId); // Save the nextTodoId
  console.log(`To-do Task added: ${newTask.title}`);
  displayDatabaseInfo(todos);
}

function listTodoTasks(status) {
  const todos = readTodos();
  if (!status) {
    console.log("To-Do List:");
    displayDatabaseInfo(todos);
    return;
  }
  if (!["to-do", "in-progress", "done"].includes(status)) {
    console.error("Invalid status. Allowed values: to-do, in-progress, done.");
    return;
  }

  const filteredTodos = todos.filter((task) => task.status === status);
  console.log(`To-Do List with status '${status}':`);
  displayDatabaseInfo(filteredTodos);
}

function editTodoTask(id, options) {
  const todos = readTodos();
  const taskToEdit = todos.find((task) => task.id === id);

  if (!taskToEdit) {
    console.error(`No task found with ID ${id}`);
    return;
  }

  if (!options.title && !options.status) {
    console.error("Specify -t or -s or both to update the task.");
    return;
  }

  if (options.title) {
    taskToEdit.title = options.title;
    console.log(`To-do task with ID ${id} edited: ${taskToEdit.title}`);
  }

  if (options.status) {
    if (!["to-do", "in-progress", "done"].includes(options.status)) {
      console.error(
        "Invalid status. Allowed values: to-do, in-progress, done."
      );
      return;
    }

    taskToEdit.status = options.status;
    console.log(`To-do task with ID ${id} marked as '${taskToEdit.status}'`);
  }

  saveTodos(todos);
  displayDatabaseInfo(todos);
}

function deleteTodoTask(id) {
  const todos = readTodos();

  const indexToDelete = todos.findIndex((obj) => obj.id === id);
  if (indexToDelete === -1) {
    console.error(`No task found with ID ${id}`);
    return;
  }

  const deletedTask = todos.splice(indexToDelete, 1);

  saveTodos(todos);
  console.log(
    `To-do task with ID ${id} deleted, which content was ${deletedTask}`
  );
  displayDatabaseInfo(todos);
}

function displayDatabaseInfo(todosToDisplay) {
  console.log(
    "\n\n---------------------- Start of database information ----------------------\n\n"
  );
  console.log(
    todosToDisplay
      .map(
        (task) => `ID:${task.id},  Title:${task.title},  Status:${task.status}`
      )
      .join("\n")
  );
  console.log(
    "\n\n---------------------- End of database information ----------------------"
  );
}

module.exports = {
  addTodoTask,
  listTodoTasks,
  editTodoTask,
  deleteTodoTask,
};

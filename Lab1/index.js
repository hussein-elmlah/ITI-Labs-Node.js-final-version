  "use strict";
  const fs = require("fs");
  const { program } = require("commander");
  const path = require("path");
  const http = require("http");

  const hostname = "localhost";
  const port = 5000;

  const server = http.createServer((req, res) => {
    if (req.url === '/todos' && req.method === "GET")
    {
      res.statusCode = 200;
          res.setHeader("Content-Type", "text/html");
          res.end(`
          <html>
            <head>
              <title>Todo List</title>
            </head>
            <body>
            <h1>Todo List page</h1>
            </body>
          </html>
          `);
    }
  })



  // Database connection
  const todosDataPath = path.join(
    __dirname,
    "databases",
    "todosDB",
    "todos.json"
  );

  let todos = JSON.parse(fs.readFileSync(todosDataPath, "utf8"));

  // Get last id
  const todosMetadataPath = path.join(
    __dirname,
    "databases",
    "todosDB",
    "todos.metadata.json"
  );

  let todosMetadata = JSON.parse(fs.readFileSync(todosMetadataPath, "utf8"));
  let nextTodoId = todosMetadata[0].counter;

  // Function to save to 'todos' database
  function saveTodoList(todosToSave) {
    fs.writeFileSync(todosDataPath, JSON.stringify(todosToSave, null, 2));
  }

  // Function to save nextTodoId to 'todos.metadata.json'
  function saveNextTodoId(nextTodoIdToSave) {
    todosMetadata[0].counter = nextTodoIdToSave;
    fs.writeFileSync(todosMetadataPath, JSON.stringify(todosMetadata, null, 2));
  }

  // Function to show database information
  function displayDatabaseInfo(todosToDisplay) {
    console.log(
      "\n\n---------------------- Start of database information ----------------------\n\n"
    );
    console.log(
      todosToDisplay
        .map((task) => {
          return `ID:${task.id},  Title:${task.title},  Status:${task.status}`;
        })
        .join("\n")
    );
    console.log(
      "\n\n---------------------- End of database information ----------------------"
    );
  }

  // Function to find task by ID
  function findTaskById(id) {
    return todos.find((task) => task.id === id);
  }

  // Function to add a to-do task
  function addTodoTask(title) {
    const newTask = {
      id: ++nextTodoId,
      title,
      status: "to-do",
    };

    todos.push(newTask);
    saveTodoList(todos);
    saveNextTodoId(nextTodoId);
    console.log(`To-do Task added: ${newTask.title}`);
    displayDatabaseInfo(todos);
  }

  // Function to list tasks
  function listTodoTasks(status) {
    if (!status) {
      console.log("To-Do List:");
      displayDatabaseInfo(todos);
      return;
    }
    if (!(status === "to-do" || status === "in-progress" || status === "done")) {
      console.error("Invalid status. Allowed values: to-do, in-progress, done.");
      return;
    }

    const filteredTodos = todos.filter((task) => task.status === status);
    console.log(`To-Do List with status '${status}':`);
    displayDatabaseInfo(filteredTodos);
  }

  // Function to edit a to-do task
  function editTodoTask(id, options) {
    const taskToEdit = findTaskById(Number(id));
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
      if (["to-do", "in-progress", "done"].includes(options.status)) {
        taskToEdit.status = options.status;
        console.log(`To-do task with ID ${id} marked as '${taskToEdit.status}'`);
      } else {
        console.error(
          "Invalid status. Allowed values: to-do, in-progress, done."
        );
        return;
      }
    }

    saveTodoList(todos);
    displayDatabaseInfo(todos);
  }

  // Function to delete a to-do task
  function deleteTodoTask(id) {
    const taskToDelete = findTaskById(Number(id));

    if (!taskToDelete) {
      console.error(`No task found with ID ${id}`);
      return;
    }

    const indexToDelete = todos.indexOf(taskToDelete);

    const deletedTask = todos.splice(indexToDelete, 1)[0];
    saveTodoList(todos);

    console.log(`To-do task with ID ${id} deleted`);
    displayDatabaseInfo(todos);
  }

  // Command to add task
  program
    .command("add")
    .description("Add a to-do Task")
    .requiredOption("-t, --title <string>", "Title of the Task")
    .action((options) => {
      addTodoTask(options.title);
    });

  // Command to list tasks
  program
    .command("list")
    .description("List all todos")
    .option(
      "-s, --status <string>",
      "Filter entries by status [to-do, in-progress, done]"
    )
    .action((options) => {
      listTodoTasks(options.status);
    });

  // Command to edit tasks
  program
    .command("edit <id>")
    .description("Edit a to-do entry by ID")
    .option("-t, --title <string>", "New title for the entry")
    .option("-s, --status <string>", "New status for the entry")
    .action((id, options) => {
      editTodoTask(id, options);
    });

  // Command to delete tasks
  program
    .command("delete <id>")
    .description("Delete a to-do entry by ID")
    .action((id) => {
      deleteTodoTask(id);
    });

  // Parse command line arguments
  program.parse(process.argv);




  // server.listen(port, hostname, () => {
  //   console.log(`Server running at http://${hostname}:${port}/`);
  // })

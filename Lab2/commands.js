// commands.js
const { program } = require('commander');
const {
  addTodoTask,
  listTodoTasks,
  editTodoTask,
  deleteTodoTask,
} = require('./todoOperations');

program
  .command('add')
  .description('Add a to-do Task')
  .requiredOption('-t, --title <string>', 'Title of the Task')
  .action((options) => {
    addTodoTask(options.title);
  });

program
  .command('list')
  .description('List all todos')
  .option(
    '-s, --status <string>',
    'Filter entries by status [to-do, in-progress, done]',
  )
  .action((options) => {
    listTodoTasks(options.status);
  });

program
  .command('edit <id>')
  .description('Edit a to-do entry by ID')
  .option('-t, --title <string>', 'New title for the entry')
  .option('-s, --status <string>', 'New status for the entry')
  .action((id, options) => {
    editTodoTask(Number(id), options);
  });

program
  .command('delete <id>')
  .description('Delete a to-do entry by ID')
  .action((id) => {
    deleteTodoTask(Number(id));
  });

// New command to start the server
program
  .command('runServer')
  .description('Start the HTTP server')
  .action(() => {
    const appServer = require('./server');
    appServer();
  });

module.exports = program;

// Parse command line arguments
// program.parse(process.argv);

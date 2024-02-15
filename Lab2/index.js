// index.js
// const appServer = require("./server");
const program = require("./commands");

// Parse command line arguments
program.parse(process.argv);

// I am not running the server here,
// because program.parse(process.argv) line in commander consumes the command-line arguments
// appServer();

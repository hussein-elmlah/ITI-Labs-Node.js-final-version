// database.js
const fs = require('fs');
const path = require('path');

const todosDataPath = path.join(
  __dirname,
  'databases',
  'todosDB',
  'todos.json',
);

const stylePath = path.join(
  __dirname,
  'databases',
  'todosDB',
  'style.css',
);
// Get last id
const todosMetadataPath = path.join(__dirname, 'databases', 'todosDB', 'todos.metadata.json');

function readMetadata() {
  try {
    const metadata = fs.readFileSync(todosMetadataPath, 'utf8');
    return JSON.parse(metadata);
  } catch (error) {
    console.error('Error reading metadata:', error.message);
    return [];
  }
}

const todosMetadata = readMetadata();
const nextTodoId = todosMetadata[0].counter;

// Function to save nextTodoId to 'todos.metadata.json'
function saveNextTodoId(nextTodoIdToSave) {
  todosMetadata[0].counter = nextTodoIdToSave;
  fs.writeFileSync(todosMetadataPath, JSON.stringify(todosMetadata, null, 2));
}

function readTodos() {
  try {
    const todosData = fs.readFileSync(todosDataPath, 'utf8');
    return JSON.parse(todosData);
  } catch (error) {
    console.error('Error reading todos data:', error.message);
    return [];
  }
}

// function readStyle() {
//   try {
//     const styleData = fs.readFileSync(stylePath, 'utf8');
//     return JSON.parse(styleData);
//   } catch (error) {
//     console.error('Error reading todos data:', error.message);
//     return [];
//   }
// }

function saveTodos(todosToSave) {
  fs.writeFileSync(todosDataPath, JSON.stringify(todosToSave, null, 2));
}

module.exports = {
  todosDataPath, nextTodoId, saveNextTodoId, readTodos, saveTodos,
};

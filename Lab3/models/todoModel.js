const fs = require("fs");
const path = require("path");

const todosDataPath = path.join(
  __dirname,
  "..",
  "databases",
  "todosDB",
  "todos.json"
);
const todosMetadataPath = path.join(
  __dirname,
  "..",
  "databases",
  "todosDB",
  "todos.metadata.json"
);

function readMetadata() {
  try {
    const metadata = fs.readFileSync(todosMetadataPath, "utf8");
    return JSON.parse(metadata);
  } catch (error) {
    console.error("Error reading metadata:", error.message);
    return [];
  }
}

function saveTodosCounter(todosCounterToSave) {
  const todosMetadata = readMetadata();

  todosMetadata[0].counter = todosCounterToSave;
  fs.writeFileSync(todosMetadataPath, JSON.stringify(todosMetadata, null, 2));
}

function todosCounterPlusOne() {
  const todosMetadata = readMetadata();

  let todosCounter = todosMetadata[0].counter;
  todosCounter++;
  saveTodosCounter(todosCounter);
  return todosCounter;
}

function readTodos() {
  try {
    const todosData = fs.readFileSync(todosDataPath, "utf8");
    return JSON.parse(todosData);
  } catch (error) {
    console.error("Error reading todos data:", error.message);
    return [];
  }
}

function saveTodos(todosToSave) {
  fs.writeFileSync(todosDataPath, JSON.stringify(todosToSave, null, 2));
}

module.exports = {
  todosCounterPlusOne,
  readTodos,
  saveTodos,
};

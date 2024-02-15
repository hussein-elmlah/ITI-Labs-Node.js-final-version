const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { readTodos } = require("./models/todoModel");

const todoRouter = require("./routes/todoRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.use("/todos", todoRouter);

// Route handler to render the SSR HTML page
app.get("/ejs", (req, res) => {
  const todos = readTodos();
  // Render the EJS template with todos data
  res.render("index", { todos });
}); 

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve SSR html page
app.get("/", (req, res) => {
  // Render SSR HTML page here
  res.sendFile(__dirname + "/views/index.html");
});

// Handle undefined routes - serve the Angular app for any other route
app.get("*", (req, res) => {
  const notFoundPagePath = path.join(__dirname, "public", "404", "index.html");
  res.status(404).sendFile(notFoundPagePath);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

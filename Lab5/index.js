const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");
const CustomError = require('./lib/customError');
// Require configuration variables from the config file
const { PORT, MONGODB_URI } = require('./config');

const app = express();

// Connect to MongoDB database
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB database");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Middlewares
app.use(express.json());
app.use(cors());

// Define route handling middleware for specific paths.
app.use("/users", userRoutes);
app.use("/todos", todoRoutes);

// Route handling middleware for handling all unmatched routes with a 404 response.
app.use("*", (req, res) => {
  res.status(404).send("Not found");
});

// error handling middleware
app.use((err, req, res, next) => {
  // If the error is a CustomError or has a status property, send the appropriate status code and message
  if (err instanceof CustomError || err.status) {
    res.status(err.status || 500).json({ error: err.message });
  } else {
    // For other errors, respond with a generic error message and status code 500
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Error handling for uncaught exceptions
process.on("uncaughtException", function (err) {
  console.log("Uncaught exception occurred:\n", err);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

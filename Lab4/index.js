const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/todosDB");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(routes);

app.use((err, req, res, next) => {
  res.status(404).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* eslint-disable import/order */
/* eslint-disable import/no-unresolved */
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/todosDB');

const PORT = process.env.PORT || 3000;

const dotenv = require('dotenv');

dotenv.config();
app.use(express.json());
app.use(routes);

app.use((err, req, res, next) => {
  res.status(err.status).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

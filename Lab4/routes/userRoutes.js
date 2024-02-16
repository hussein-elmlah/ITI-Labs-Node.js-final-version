const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/usersController");
const asyncWrapper = require("../lib/async-wrapper");

router.post("/", async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.createUser(req.body));
  console.log(err,user);
  if (err) {
    return next(err);
  }
  res.status(201).json(user);
});

router.get("/", async (req, res, next) => {
  const [err, users] = await asyncWrapper(UsersController.getUsersFirstName());
  if (err) {
    return next(err);
  }
  res.json(users);
});

router.delete("/:id", async (req, res, next) => {
  const [err] = await asyncWrapper(UsersController.deleteUser(req.params.id));
  if (err) {
    return next(err);
  }
  res.sendStatus(204);
});

router.patch("/:id", async (req, res, next) => {
  const [err, user] = await asyncWrapper(
    UsersController.updateUser(req.params.id, req.body)
  );
  if (err) {
    return next(err);
  }
  res.json({ user });
});

router.get("/:userId/todos", async (req, res, next) => {
  const [err, todos] = await asyncWrapper(
    UsersController.getTodosByUserId(req.params.userId)
  );
  if (err) {
    return next(err);
  }
  res.json(todos);
});

module.exports = router;

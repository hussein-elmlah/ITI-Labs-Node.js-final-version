const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/usersController");
const asyncWrapper = require("../lib/async-wrapper");
const generateToken = require('../utils/jwtUtils');
const {authenticateUser} = require("../middlewares/authentication");
const { authorizeUser, checkRole, authorizeUserOrAdmin } = require('../middlewares/authorization');


router.post("/", async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.createUser(req.body));
  if (err) {
    return next(err);
  }
  const token = generateToken(user);

  res.status(201).json({ user, token });
});

router.post("/login", async (req, res, next) => {
  const {body: {username, password}} = req;
  const [err, user] = await asyncWrapper(
    UsersController.loginUser({username, password})
  );
  if (err) {
    return next(err);
  }
  res.json(user);
});

router.get("/", authenticateUser, checkRole('admin'), async (req, res, next) => {
  const [err, users] = await asyncWrapper(UsersController.getUsersFirstName());
  if (err) {
    return next(err);
  }
  res.json(users);
});

router.delete("/:id", authenticateUser, authorizeUserOrAdmin, async (req, res, next) => {
  const [err] = await asyncWrapper(UsersController.deleteUser(req.params.id));
  if (err) {
    return next(err);
  }
  res.sendStatus(204);
});

router.patch("/:id", authenticateUser, authorizeUserOrAdmin, async (req, res, next) => {
  const [err, user] = await asyncWrapper(
    UsersController.updateUser(req.params.id, req.body)
  );
  if (err) {
    return next(err);
  }
  res.json({ user });
});

router.get("/:userId/todos", authenticateUser, authorizeUser, async (req, res, next) => {
  const [err, todos] = await asyncWrapper(
    UsersController.getTodosByUserId(req.params.userId)
  );
  if (err) {
    return next(err);
  }
  res.json(todos);
});

module.exports = router;

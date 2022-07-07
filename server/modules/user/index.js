const { Router } = require('express');
const UserController = require('./controller');
const authenticate = require('../../middlewares/authenticate');

const userRouter = Router();

userRouter.post('/signup', (req, res) => {
  let data = {
    body: req.body,
    url: req.originalUrl,
  };
  UserController.create(data, res);
});

userRouter.post('/login', (req, res) => {
  let data = {
    body: req.body,
    url: req.originalUrl,
  };
  UserController.login(data, res);
});

userRouter.get('/me', authenticate, (req, res) => {
  let data = {
    url: req.originalUrl,
    user: req.user,
  };
  UserController.profile(data, res);
});

userRouter.put('/profile/:userId', authenticate, (req, res) => {
  let data = {
    url: req.originalUrl,
    user: req.user,
    body: req.body,
    params: req.params,
  };
  UserController.edit(data, res);
});

userRouter.put('/changePassword', authenticate, (req, res) => {
  let data = {
    url: req.originalUrl,
    user: req.user,
    body: req.body,
  };
  UserController.changePassword(data, res);
});

userRouter.get('/check-email', (req, res) => {
  let data = {
    url: req.originalUrl,
    query: req.query,
  };
  UserController.checkEmail(data, res);
});

module.exports = userRouter;

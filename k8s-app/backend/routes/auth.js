const express = require('express')
const Router = express.Router();
const { register, login, getUser } = require('../controllers/auth')

Router.post('/register', register);
Router.post('/login', login);
Router.get('/', getUser);


module.exports = Router;
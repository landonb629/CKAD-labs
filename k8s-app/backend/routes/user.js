const express = require('express')
const Router = express.Router()

const {getUsers, createUser, updateUser, deleteUser} = require('../controllers/user')

Router.route('/').get(getUsers).post(createUser)
Router.route('/:id').patch(updateUser).delete(deleteUser)

module.exports = Router
const express = require('express')
const userController = require('../controllers/users-controller')

const router = express.Router()

router.route('/sign-up')
  .post(userController.createUser)

router.route('/:id')
  .delete(userController.deleteUser)

module.exports = router

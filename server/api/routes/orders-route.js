const express = require('express')
const ordersController = require('../controllers/orders-controller')


const router = express.Router()

router.route('/')
  .get(ordersController.getOrders)
  .post(ordersController.postOrder)

router.route('/:id')
  .get(ordersController.getOrdersById)
  .delete(ordersController.deleteOrder)

module.exports = router

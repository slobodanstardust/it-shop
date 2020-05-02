const express = require('express')
const productsController = require('../controllers/products')


const router = express.Router()

router.route('/')
  .get(productsController.getProducts)
  .post(productsController.postProduct)

router.route('/:id')
  .get(productsController.getProductsById)
  .put(productsController.putProduct)
  .delete(productsController.deleteProduct)

module.exports = router

const express = require('express')
const productsController = require('../controllers/products-controller')


const router = express.Router()

router.route('/')
  .get(productsController.getProducts)
  .post(productsController.fileUpload, productsController.postProduct)

router.route('/:id')
  .get(productsController.getProductsById)
  .put(productsController.fileUpload, productsController.putProduct)
  .delete(productsController.deleteProduct)

module.exports = router

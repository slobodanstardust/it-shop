const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')


// GET
exports.getOrders = (req, res, next) => {
  const parameters = req.query

  Order.find()
    .select('_id product quantity')
    .populate('product', '_id category brand name processor memory storage display price')
    .sort(parameters) // Values allowed are asc, desc, ascending, descending, 1, and -1 (.sort({ field: 'asc' })).
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        orders: docs.map(item => {
          return {
            ...item._doc,
            request: {
              type: 'GET',
              url: `http://localhost:3000/orders/${item._id}`
            }
          }
        })
      }
      console.log(response)
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

// POST
exports.postOrder = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(doc => {
      if (!doc) return res.status(404).json({ message: 'Document not found.'})
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: doc._id, // I could use 'req.body.productId'.
        quantity: req.body.quantity
      })
      return order.save() // I return this here to prevent more nesting.
    })
    .then(result => {
      const response = {
        ...result._doc,
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders/${result._id}`,
          description: 'Get the created order.'
        }
      }
      console.log(response)
      res.status(201).json(response)
    }) // Can't use exec() nor select() after save().
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

// GET by ID
exports.getOrdersById = (req, res, next) => {
  const id = req.params.id
  
  Order.findById(id)
    .select('_id product quantity')
    .populate('product', '_id category brand name processor memory storage display price')
    .exec()
    .then(doc => {
      if (doc) {
        const response = {
          ...doc._doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders',
            description: 'Get a list of all orders.'
          }
        }
        console.log(response)
        res.status(200).json(response)
      }
      else res.status(404).json({ message: 'Document not found.' })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

// DELETE
exports.deleteOrder = (req, res, next) => {
  const id = req.params.id

  Order.deleteOne({ _id: id })
    .exec()
    .then(result => {
      const response = {
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products',
          body: {
            productId: 'ID',
            quantity: 'Number'
          },
          description: 'To create a new order.'
        }
      }
      console.log(response)
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}
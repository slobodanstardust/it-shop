const mongoose = require('mongoose')
const Product = require('../models/product')
const productsData = require('../../products-db')

// GET
exports.getProducts = async (req, res, next) => {
  const count = await Product.countDocuments() // I need count of all the documents.

  const parameters = req.query
  
  // For pagination.
  const page = Number(parameters.page)
  const pageSize = Number(parameters.pageSize)
  const pageCount = Math.ceil(count / pageSize)

  // For sorting documents.
  let sort = {}
  if (parameters.name) sort = { name: parameters.name }
  else if (parameters.price) sort = { price: parameters.price }

  // For filtering responses.
  let filter = {}
  if (parameters.filter) filter = JSON.parse(parameters.filter)

  if (req.query.reset == 'yes') { // For reseting the collection. Parameters: { reset: 'yes' }.
    let response = ''
    Product.deleteMany({})
      .exec()
      .then(result => response = result)

    Product.insertMany(productsData)
      .then(docs => {
          console.log(docs)
          res.status(200).json({
            message: 'Old data deleted, and new data inserted.',
            insertedDocuments: docs
          })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ error: err })
      })
  } else {
    Product.find(filter) // Filter by: brand, procesor, memory, storage, display.
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('_id category brand name processor memory storage display price')
      .sort(sort) // Values allowed are asc, desc, ascending, descending, 1, and -1.
      .exec()
      .then(docs => {
        const response = {
          page: page,
          pageSize: docs.length,
          pageCount: pageCount,
          count: count,
          products: docs
        }
        console.log(response)
        res.status(200).json(response)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ error: err })
      })
  }
}

// POST
exports.postProduct = (req, res, next) => {
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    category: req.body.category,
    brand: req.body.brand,
    name: req.body.name,
    processor: req.body.processor,
    memory: req.body.memory,
    storage: req.body.storage,
    display: req.body.display,
    price: req.body.price
  })

  product.save()
    .then(() => {
      Product.findOne({ _id: product._id})
        .select('_id category brand name processor memory storage display price')
        .exec()
        .then(result => {
          console.log(result)
          res.status(201).json({
            message: 'Document created.',
            document: result
          })
        })
    }) // Can't use exec() nor select() after save().
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

// GET by ID
exports.getProductsById = (req, res, next) => {
  const id = req.params.id

  Product.findById(id)
    .select('_id category brand name processor memory storage display price')
    .exec()
    .then(doc => {
      if (doc) {
        console.log(doc)
        res.status(200).json(doc)
      } else res.status(404).json({ message: 'Document not found.' })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

// PUT
exports.putProduct = (req, res, next) => {
  const id = req.params.id

  Product.findByIdAndUpdate({ _id: id }, req.body)
    .exec()
    .then(() => {
      Product.findOne({ _id: id })
      .select('_id category brand name processor memory storage display price')
      .exec()
      .then(doc => {
        if (doc) {
          console.log(doc)
          res.status(201).json({
            message: 'Documnet updated.',
            document: doc
          })
        } else res.status(404).json({ message: 'Document not found.' })
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

// DELETE
exports.deleteProduct = (req, res, next) => {
  const id = req.params.id
  let deleted = {}

  Product.findOne({ _id: id })
    .select('_id category brand name processor memory storage display price')
    .exec()
    .then(doc => {
      if (doc) {
        deleted = doc
        Product.deleteOne({ _id: id })
          .exec()
          .then(result => {
            console.log(deleted)
            res.status(200).json({
              message: 'Document deleted.',
              document: deleted
            })
          })
      } else res.status(404).json({ message: 'Document not found.' })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

const mongoose = require('mongoose')
const multer = require('multer')
const fs = require('fs')
const productsData = require('../../products-db')
const Product = require('../models/product')

mongoose.set('useFindAndModify', false); // Because findByIdAndUpdate is depreciated. This is the fix.

// Multer confuguration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${uniquePrefix}-${file.originalname}`)
  }
})

function fileFilter (req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb(null, true)
  else cb(new Error('Wrong file format.'), false)
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // File size in bites.
  },
  fileFilter: fileFilter
})

exports.fileUpload = upload.single('image')

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

    Product.find() // For deleting images associated to products, from 'uploads' folder.
      .exec()
      .then(docs => {
        docs.forEach((item) => {
          const path = `./${item.imagePath}`
          fs.unlink(path, (err) => {
            if (err) {
              console.error(err)
              return
            }    
            //file removed
          })
        })
      })

    Product.deleteMany({}) // For deleting all documents.
      .exec()
      .then(result => response = result)

    Product.insertMany(productsData) // For loadind starter collection.
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
      .select('_id category brand name processor memory storage display price imagePath')
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
  if (isNaN(req.body.price)) req.body.price = 0
  else req.body.price = Number(req.body.price)
  
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    category: req.body.category,
    brand: req.body.brand,
    name: req.body.name,
    processor: req.body.processor,
    memory: req.body.memory,
    storage: req.body.storage,
    display: req.body.display,
    price: Number(req.body.price),
    imagePath: req.file && req.file.path || ''
  })

  product.save()
    .then(() => {
      Product.findOne({ _id: product._id})
        .select('_id category brand name processor memory storage display price imagePath')
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
    .select('_id category brand name processor memory storage display price imagePath')
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

  if (req.file) {
    const newPath = req.file.path  
    req.body.imagePath = newPath // Inserting new imagePath into the req.body.

    Product.findById(id) // For deleting old image from 'uploads' folder.
    .exec()
    .then(doc => {
      const path = `./${doc.imagePath}`
      fs.unlink(path, (err) => {
        if (err) {
          console.error(err)
          return
        }    
        //file removed
      })
    })
  }

  if (isNaN(req.body.price)) req.body.price = 0
  else req.body.price = Number(req.body.price)

  Product.findByIdAndUpdate({ _id: id }, req.body)
    .exec()
    .then(() => {
      Product.findOne({ _id: id })
      .select('_id category brand name processor memory storage display price imagePath')
      .exec()
      .then(doc => {
        if (doc) {
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
    .select('_id category brand name processor memory storage display price imagePath')
    .exec()
    .then(doc => {
      if (doc) {
        deleted = doc

        const path = `./${deleted.imagePath}`
        fs.unlink(path, (err) => { // Deleting image file.
          if (err) {
            console.error(err)
            return
          }    
          //file removed
        })

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

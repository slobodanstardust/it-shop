const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const productsRoutes = require('./api/routs/produtcs')
const ordersRoutes = require('./api/routs/orders')


const app = express()

mongoose.connect(
  'mongodb+srv://ItShop:ItShop@showroom-f5tpk.mongodb.net/it-shop?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use('/images', express.static('images'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    return res.status(200).json({})
  }
  next()
}) // For CORS errors.

app.use('/products', productsRoutes)
app.use('/orders', ordersRoutes)

app.use((req, res, next) => {
  const err = new Error('Error! Data not found.')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    error: {
      message: err.message
    }
  })
})

module.exports = app
const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  category: { type: String },
  brand: { type: String },
  name: { type: String },
  processor: { type: String },
  memory: { type: String },
  storage: { type: String },
  display: { type: String },
  price: { type: Number },
  imagePath: { type: String } // For uploading an image.
})

module.exports = mongoose.model('Product', productSchema)
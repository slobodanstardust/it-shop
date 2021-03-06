const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  category: { type: String, required: true },
  brand: { type: String, required: true },
  name: { type: String, required: true },
  processor: { type: String, required: true },
  memory: { type: String, required: true },
  storage: { type: String, required: true },
  display: { type: String, required: true },
  price: { type: Number, required: true },
  imagePath: { type: String }, // For uploading an image.
  fixed: { type: Boolean, default: false } // For the 'reset' part.
})

module.exports = mongoose.model('Product', productSchema)
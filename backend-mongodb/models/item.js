const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
  name: { type: String, required: true},
  description: { type: String, required: true},
  individualPrice: { type: Number, required: true},
  individualTax: { type: Number, required: true},
  individualShipping : { type: Number, required: true},
  manufacturer: { type: String, required: true},
  reviews: { type: Array, required: false},
  rating: { type: Number, required: true}
});

module.exports = mongoose.model('Item', itemSchema);

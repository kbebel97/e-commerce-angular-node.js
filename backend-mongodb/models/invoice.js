const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({
  date: { type: String, required: true},
  total: { type: Number, required: true},
  tax: { type: Number, required: true},
  shipping: { type: Number, required: true},
  quantity: { type: Number, required: true},
  isReturned: { type: Boolean, required: true},
  purchasedItems: { type: Array, required: true}
});

module.exports = mongoose.model('Invoice', invoiceSchema);

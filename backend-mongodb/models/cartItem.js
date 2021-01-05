const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  itemId: { type: String, required: true},
  qty: { type: Number, required: true},
  item: {type: Object, required: true}
});

module.exports = mongoose.model('Cartitem', cartSchema);

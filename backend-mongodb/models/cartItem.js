const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  itemId: { type: String, required: true},
  qty: { type: Number, required: true},
  item: {type: Object, required: true}
});

module.exports = mongoose.model('Cartitem', cartSchema);

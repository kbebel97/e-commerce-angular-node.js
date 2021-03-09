const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  itemId: {type: String, required: true},
  email: { type: String, required: true},
  userName: {type: String, required: false},
  rating: { type: Number, required: true},
  comment: { type: String, required: false},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model('Review', reviewSchema);

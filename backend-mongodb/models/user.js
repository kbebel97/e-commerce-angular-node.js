const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


//Unique in this case does not validate input, it is used internally by mongoose for
//optimization purposes
//For that we install npm install --save mongoose-unique-validator
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  userName: { type: String, required: false},
  firstName: { type: String, required: false},
  lastName: { type: String, required: false},
  paymentMethods: { type: Array, required: false},
  shippingAddresses: { type: Array, required: false},
  imagePath: { type: String, required: false},
  isAdmin: { type: String, required: false}
});

//Unique validator does this
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

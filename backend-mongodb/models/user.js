const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


//Unique in this case does not validate input, it is used internally by mongoose for
//optimization purposes
//For that we install npm install --save mongoose-unique-validator
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true}
});

//Unique validator does this
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

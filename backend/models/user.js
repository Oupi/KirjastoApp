var mongoose = require("mongoose");

var schema = mongoose.Schema;

module.exports = mongoose.model("User", new schema({
  userName: {type: String, unique: true},
  pword: {type: String, required: true},
  admin: {type: Number, min: 0, max: 1}
}));

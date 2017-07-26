var mongoose = require("mongoose");

var schema = mongoose.Schema;

module.exports = mongoose.model("Book", new schema({
  author:{type:String, required: true, index: true},
  title: String,
  loaned: String
}));

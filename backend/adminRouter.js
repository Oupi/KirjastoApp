var express = require("express");
var mongoose = require("mongoose");

var config = require("./config");

var Book = require("./models/book");
var User = require("./models/user");

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useMongoClient:true});

var adminRouter = express.Router();

adminRouter.use(function(req, res, next){
  var token = req.headers.token;
  if(token == "admin"){
    console.log("Authorized admin access");
    console.log(req.headers);
    next();
  } else {
    res.send("No cigar. Unauthorized access. Wrong token.")
  }
});

adminRouter.post("/book", function(req, res){
  // book: author, title, loaned
	var book = new Book({
		"author": req.body.author,
		"title": req.body.title,
		"loaned":""
	});

	book.save(function(err){
		if(err){
			throw err;
		}
		console.log(book);
		res.send("Done");
	});
});

adminRouter.delete("/book", function(req, res){
	var id = req.body.id;
	console.log(id);
	Book.remove({"_id":id}, function(err){
		if(err){
			throw err;
		}
		console.log("Removed");
		res.send("Removed");
	});
});

module.exports = adminRouter;

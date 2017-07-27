var express = require("express");
var mongoose = require("mongoose");

var config = require("./config");

var Book = require("./models/book");
var User = require("./models/user");

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useMongoClient:true});

var userRouter = express.Router();

// userRouter.use(function(req, res, next){
//   var token = req.headers.token;
//   if(token == "user" || token == "admin"){
//     console.log("Authorized access");
//     console.log(req.headers);
//     next();
//   } else {
//     res.send("No cigar. Unauthorized access. Wrong token.")
//   }
// });

userRouter.post("/book", function(req, res){
  // book: id, author, title, loaned
	Book.findById(req.body.id, function(err,item,count){
		if(err){
			throw err;
		} else {
			if(item.loaned != ""){
				if(req.body.user == item.loaned){
					item.loaned = "";
					item.save(function(err,updatedItem){
						if(err){
							throw err;
						}else {
							res.send({
								"id":updatedItem._id,
								"loaned":updatedItem.loaned
							});
						}
					});
				} else {
					res.status(403).send("Already loaned");
				}
			} else {
				console.log("Loaning book.");
				item.loaned = req.body.user;
				item.save(function(err,updatedItem){
					if(err){
						throw err;
					} else {
						console.log("Succesful loan");
						res.send({"id":updatedItem._id, "loaned":updatedItem.loaned});
					}
				});
			}
		}
	});
});

userRouter.get("/book", function(req, res) {
  if(req.query.author){
    var author = req.query.author;
    Book.find({"author":author},function(err, items){
      if(err){
        throw err;
      }else {
        res.send(JSON.stringify(items));
      }
    });
  }else {
    Book.find(function(err, items, count){
      if(err){
        throw err;
      }else {
        res.send(JSON.stringify(items));
      }
    });
  }

});

module.exports = userRouter;

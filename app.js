var express     = require("express");
var bodyParser  = require("body-parser");
var path        = require("path");
var mongoose		= require("mongoose");
var config			= require("./backend/config");

var User 				= require("./backend/models/user");
var Book 				= require("./backend/models/book");

var app = express();
var userRouter = express.Router();
var adminRouter = express.Router();

app.use(bodyParser.json({extended:"true"}));

app.use(express.static(path.join(__dirname,"public_www")));

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useMongoClient:true});

/**
var userList = [{user:"admin", password:"admin", admin:1}];
var bookList = [{
			author:"Kiayada Delacruz",
			title:"Duis a",
			id:100,
      loaned: ""
		},
		{
			author:"Audrey V. Lester",
			title:"Aliquam nec enim. Nunc",
			id:101,
      loaned: ""
		},
		{
			author:"Quincy S. Rojas",
			title:"lorem ut aliquam iaculis,",
			id:102,
      loaned: ""
		},
		{
			author:"Zoe O. Young",
			title:"aptent taciti sociosqu",
			id:103,
      loaned: ""
		},
		{
			author:"Ivor Cook",
			title:"Curabitur",
			id:104,
      loaned: ""
		},
		{
			author:"Chaney X. Lott",
			title:"orci tincidunt",
			id:105,
      loaned: ""
		}
];
*/

app.post("/login", function(req, res){
  // var found = false;
  // for(var i = 0; i < userList.length; i++){
  //   if(req.body.userName == userList[i].user){
  //     found = true;
  //   }
  //   if(found){
  //     if(req.body.pword == userList[i].password){
  //       if(userList[i].admin == 1){
  //         res.json({token:"admin", user:userList[i].user});
  //         return;
  //       }else {
  //         res.json({token:"user", user:userList[i].user});
  //         return;
  //       }
  //     }
  //   }
	User.findOne({userName:req.body.userName}, function(err, user){
		if(err){
			throw err;
		}
		if(user){
			if(user.admin == 1){
				res.json({token:"admin", user:user.userName});
				return;
			}else{
				res.json({token:"user", user:user.userName});
				return;
			}
		}else {
			res.status(403).send("No luck. Luke.");
		}
	});
});

app.post("/newUser", function(req,res){
  var userName = req.body.userName;
  var pword = req.body.pword;

	console.log(userName);
	console.log(pword);
	var newUser = new User({userName:userName, pword:pword, admin:0});

	newUser.save(function(err){
		console.log("In save");
		if(err){
			throw err;
		}
		console.log(newUser);
	});
	//
  // for(var i = 0; i < userList.length; i++ ){
  //   if(req.body.userName == userList[i].user){
  //     res.send("Failure. User already exists.");
  //     return;
  //   }
  // }
	//
  // var user = {user:userName,
  //             password:pword,
  //             admin:0 };
	//
	//
  // userList.push(user);
  // console.log(userList);
  res.send("Success");
});


// User router starts here
userRouter.use(function(req, res, next){
  var token = req.headers.token;
  if(token == "user" || token == "admin"){
    console.log("Authorized access");
    console.log(req.headers);
    next();
  } else {
    res.send("No cigar. Unauthorized access. Wrong token.")
  }
});

userRouter.post("/book", function(req, res){
  // book: id, author, title, loaned
  // for(var i = 0; i < bookList.length; i++){
  //   if(req.body.id == bookList[i].id){
  //     if(bookList[i].loaned != ""){
  //       if(req.body.user == bookList[i].loaned){
  //         bookList[i].loaned = "";
  //         res.send({"id":bookList[i].id,"loaned":""});
  //         console.log("Book" + bookList[i].id + "returned");
  //         return;
  //       }
  //     } else {
  //       console.log(req.body.user + " loaning book");
  //       bookList[i].loaned = req.body.user;
  //       res.send({"id":bookList[i].id,"loaned":bookList[i].loaned});
  //       console.log("Book " + bookList[i].id + " loaned");
  //       return;
  //     }
  //   }
  // }

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
	Book.find(function(err, items, count){
		if(err){
			throw err;
		}else {
			res.send(JSON.stringify(items));
		}
	});
});

//////////////////////////////
// Admin Router Starts Here //
//////////////////////////////

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

app.use("/api/admin", adminRouter);
app.use("/api", userRouter);



app.listen(3000, function(){
  console.log("Listening port 3000...")
});

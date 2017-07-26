var express     = require("express");
var bodyParser  = require("body-parser");
var path        = require("path");
var mongoose		= require("mongoose");
var config			= require("./backend/config");
var userRouter 	= require("./backend/userRouter");
var adminRouter = require("./backend/adminRouter");

var User 				= require("./backend/models/user");
var Book 				= require("./backend/models/book");

var app 				= express();

app.use(bodyParser.json({extended:"true"}));

app.use(express.static(path.join(__dirname,"public_www")));

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useMongoClient:true});

app.post("/login", function(req, res){
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
  res.send("Success");
});

app.use("/api/admin", adminRouter);
app.use("/api", userRouter);

app.listen(3000, function(){
  console.log("Listening port 3000...")
});

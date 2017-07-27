var express     = require("express");
var bodyParser  = require("body-parser");
var path        = require("path");
var mongoose		= require("mongoose");
var session			= require("express-session");
var mongoStore	= require("connect-mongo")(session);
var config			= require("./backend/config");
var userRouter 	= require("./backend/userRouter");
var adminRouter = require("./backend/adminRouter");

var User 				= require("./backend/models/user");
var Book 				= require("./backend/models/book");

var app 				= express();

app.use(session({
	secret:config.secret,
	saveUninitialized:false,
	resave:true,
	cookie:{maxAge:1000*60*60*24},
	store:new mongoStore({
		collection:"session",
		url:"mongodb://localhost/sessionDb",
		ttl:24*60*60
	})
}));

app.use(bodyParser.json({extended:"true"}));

app.use(express.static(path.join(__dirname,"public_www")));

app.use("/api", function(req, res, next){
	if(req.session.token == req.headers.token){
		console.log("Success: " + req.session.token);
		next();
	} else{
		console.log("No success");
		res.status(403).send("No chance. Wrong token. No access.");
	}
});

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useMongoClient:true});

app.post("/login", function(req, res){

	User.findOne({userName:req.body.userName}, function(err, user){
		if(err){
			throw err;
		}
		if(user){
			if(user.pword == req.body.pword){
				if(user.admin == 1){
					req.session.token = "admin";
					res.json({token:"admin", user:user.userName});
					return;
				} else {
					req.session.token = "user";
					res.json({token:"user", user:user.userName});
					return;
				}
			}	else {
				res.status(403).send("No luck. Luke.");
			}
		}	else {
			res.status(403).send("No luck. Luke.");
		}
	});
});

app.post("/logout", function(req,res){
	if(req.session){
		req.session.destroy();
	}
	res.send("Logged out");
});

app.post("/newUser", function(req,res){
	var admin = 0;

	User.find().exec(function(err, items){
		var count = items.length;
		if(count == 0){
			admin = 1;
		}
		var userName = req.body.userName;
	  var pword = req.body.pword;

		console.log(userName);
		console.log(pword);
		User.find({"userName":userName}).exec(function(err, items){
			var tempCount = items.length;
			if(tempCount > 0){
				res.status(403).send("Username already in use");
				return;
			}
			var newUser = new User({userName:userName, pword:pword, admin:admin});
			console.log(newUser);
			newUser.save(function(err){
				console.log("In save");
				if(err){
					throw err;
				}
				console.log(newUser);
			});
			res.send("Success");
		});
	});
});

app.use("/api/admin", adminRouter);
app.use("/api", userRouter);

app.listen(3000, function(){
  console.log("Listening port 3000...")
});

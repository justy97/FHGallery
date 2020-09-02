var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds");

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
				   
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "FH is broken",
	resave:false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
})

app.get("/",function(req,res){
	res.render("landing");
})

// RESTful INDEX route - show all campgrounds
app.get("/campgrounds",function(req,res){
	//Get all campgrounds from DB
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allcampgrounds})
		}
	});
});

// RESTful NEW route - show form to create new campground
app.get("/campgrounds/new",function(req,res){
	res.render("campgrounds/new");
})

// RESTful CREATE route - add new campground to DB
app.post("/campgrounds",function(req,res){
// 	get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCamp = {name:name, image:image, description:desc};
	//save to DB
	Campground.create(newCamp,function(err,newlyCreated){
		if(err){
			console.log(err);
		} else{
			// 	redirect back to campground page
			res.redirect("/campgrounds");
		}
	});
});

//RESTful SHOW route - show additional info of 1 item
app.get("/campgrounds/:id", function(req,res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		} else{
			//render show template with selected campground
			res.render("campgrounds/show",{campground:foundCampground});
		}
	});
	
});

// ==================================================  ==================================================
//COMMENTS ROUTES
// ==================================================  ==================================================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		} else{
			//render comments/new
			res.render("comments/new",{campground:campground});
		}
	});
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		} else{
			//render comments/new
				Comment.create(req.body.comment,function(err,comment){
				if(err){console.log(err)}
				else{
					campground.comments.push(comment)
					campground.save()
					res.redirect("/campgrounds/"+campground._id)
				}
			})
		}
	});
})

//=============AUTH ROUTES================

//SHOW REGISTER FORM
app.get("/register",function(req,res){
	res.render("register");
})

//Handle Signup Logic
app.post("/register",function(req,res){
	const newUser = new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register")
		}
		passport.authenticate("loca")(req,res,function(){
			res.redirect("/campgrounds")
		})
	})
})

//SHOW login form
app.get("/login",function(req,res){
	res.render("login");
})

//Handle Login Logic
app.post("/login", passport.authenticate("local",
	{
		successRedirect:"/campgrounds",
		failureRedirect:"/login"
	}),function(req,res){
})

//Log Out
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/campgrounds");
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect("/login");
	}
}

app.listen(3000,function(){
	console.log('The YelpCamp Server started on port 3000');
});


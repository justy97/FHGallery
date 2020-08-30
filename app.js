const express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose");
	Campground = require("./models/campground");
	Comment = require("./models/comment");
	seedDB = require("./seeds");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
seedDB();

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

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
			res.render("index",{campgrounds:allcampgrounds})
		}
	});
});

// RESTful NEW route - show form to create new campground
app.get("/campgrounds/new",function(req,res){
	res.render("new");
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
			res.render("show",{campground:foundCampground});
		}
	});
	
})

app.listen(3000,function(){
	console.log('The YelpCamp Server started on port 3000');
});


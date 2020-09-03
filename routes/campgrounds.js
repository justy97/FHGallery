const express=require("express");
const router = express.Router();
const Campground = require("../models/campground");

// INDEX route - show all campgrounds
router.get("/",function(req,res){
	//Get all campgrounds from DB
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allcampgrounds})
		}
	});
});

// NEW route - show form to create new campground
router.get("/new",function(req,res){
	res.render("campgrounds/new");
})

// CREATE route - add new campground to DB
router.post("/",function(req,res){
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

// SHOW route - show additional info of 1 item
router.get("/:id", function(req,res){
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

//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect("/login");
	}
}

module.exports=router;
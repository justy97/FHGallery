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
router.get("/new",isLoggedIn, function(req,res){
	res.render("campgrounds/new");
})

// CREATE route - add new campground to DB
router.post("/",isLoggedIn, function(req,res){
// 	get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author ={
		id:req.user._id,
		username:req.user.username
	}
	var newCamp = {name:name, image:image, description:desc, author:author};
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

//EDIT CAMPGROUND route
router.get("/:id/edit", checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		res.render("campgrounds/edit",{campground:foundCampground});
	})
})

//UPDATE CAMPGROUND route
router.put("/:id", checkCampgroundOwnership,function(req,res){
	//find and update
	Campground.findByIdAndUpdate(req.params.id,req.body.camp,function(err,updatedCampground){
		if(err){res.redirect("/campgrounds");}
		else{
			//redirect to show page
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

//DESTROY route
router.delete("/:id", checkCampgroundOwnership,async(req,res)=>{
	try{
		let foundCampground = await Campground.findById(req.params.id);
		await foundCampground.remove();
		res.redirect("/campgrounds");
	}  
	catch(error){
		console.log(err);
		res.redirect("/campgrounds");
	}
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

function checkCampgroundOwnership(req,res,next){
		if(req.isAuthenticated()){//if user is logged in:
		Campground.findById(req.params.id,function(err,foundCampground){
			if(err){res.redirect("back");}
			else{
				//foundCampground.author.id is a Mongoose object, req.user._id is a String
				if(foundCampground.author.id.equals(req.user._id)){//if the user owns the campground
					next();
				}
				else{
					res.redirect("back");
				}
			}
		})
	}
	else{
		res.redirect("back");
	}
}

module.exports=router;
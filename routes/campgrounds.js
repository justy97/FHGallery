const express=require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");//if we require a directory w/o file, it requires index file

const multer = require('multer');//multer config
const storage = multer.diskStorage({
	filename: function(req, file, callback) {
		callback(null, Date.now() + file.originalname);
	}
});
const imageFilter = function (req, file, cb) {
	// accept image files only
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
		return cb(new Error('Only image files are allowed!'), false);
	}
	cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter})

const cloudinary = require('cloudinary');//cloudinary config
cloudinary.config({ 
	cloud_name: 'tiandi', 
	api_key: process.env.CLOUDINARY_API_KEY, 
	api_secret: process.env.CLOUDINARY_API_SECRET
});

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
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
})

// CREATE route - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
	cloudinary.uploader.upload(req.file.path, function(result) {
		// add cloudinary url for the image to the campground object under image property
		req.body.campground.image = result.secure_url;
		// add author to campground
		req.body.campground.author = {
			id: req.user._id,
			username: req.user.username
		}
		Campground.create(req.body.campground, function(err, campground) {
		if (err) {
			req.flash('error', err.message);
			return res.redirect('back');
		}
		res.redirect('/campgrounds/' + campground.id);
		});
	});  
});

// SHOW route - show additional info of 1 item
router.get("/:id", function(req,res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error","Campground not found");
			res.redirect("back");
		} else{
			//render show template with selected campground
			res.render("campgrounds/show",{campground:foundCampground});
		}
	});
	
});

//EDIT CAMPGROUND route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		res.render("campgrounds/edit",{campground:foundCampground});
	})
})

//UPDATE CAMPGROUND route
router.put("/:id", middleware.checkCampgroundOwnership,function(req,res){
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
router.delete("/:id", middleware.checkCampgroundOwnership,async(req,res)=>{
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

module.exports=router;
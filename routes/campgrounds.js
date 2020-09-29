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

// INDEX route - show all posts
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

// NEW route - show form to create new post
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
})

// CREATE route - add new post to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
	cloudinary.v2.uploader.upload(req.file.path, function(err,result) {
		if(err){
			req.flash('err',err.message);
			return res.redirect('back');
		}
		// add cloudinary url for the image to the campground object under image property
		req.body.campground.image = result.secure_url;
		// add image's public_id to campground object
		req.body.campground.imageId = result.public_id;
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

//EDIT POST route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error","Campground not found");
			res.redirect("back");
		} else{
			//render EDIT template with selected campground
			res.render("campgrounds/edit",{campground:foundCampground});
		}
	})
})

//UPDATE POST route
router.put("/:id", upload.single('image'), middleware.checkCampgroundOwnership, function(req,res){
	//find by Id
	Campground.findById(req.params.id, async function(err,updatedCampground){
		if(err){
			req.flash("error",err.message);
			res.redirect("back");
		}
		else{
			if(req.file){
				try{
					await cloudinary.v2.uploader.destroy(updatedCampground.imageId);
					let result = await cloudinary.v2.uploader.upload(req.file.path);
					updatedCampground.imageId = result.public_id;
					updatedCampground.image = result.secure_url;
				} catch(err){
					req.flash("error",err.message);
					return res.redirect("back");
				}
			}
			// update name and description
			updatedCampground.name = req.body.name;
			updatedCampground.description = req.body.description;
			updatedCampground.save();
			
			//redirect to show page and flash message if successful
			req.flash("success","Successfully Update!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

//DESTROY route
router.delete("/:id", middleware.checkCampgroundOwnership,async(req,res)=>{
	try{
		let foundCampground = await Campground.findById(req.params.id);
		await cloudinary.v2.uploader.destroy(foundCampground.imageId);
		await foundCampground.remove();
		req.flash('success','Post deleted successfully');
		res.redirect("/campgrounds");
	}  
	catch(err){
		req.flash("error",err.message);
		res.redirect("/campgrounds");
	}
});

module.exports=router;
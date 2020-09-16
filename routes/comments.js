const express=require("express");
const router = express.Router({mergeParams:true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");//if we require a directory w/o file, it requires index file

//Comments NEW
router.get("/new",  middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err || !campground){
			req.flash("error","Campground not found");
			res.redirect("/campgrounds")
		} else{
			//render comments/new
			res.render("comments/new",{campground:campground});
		}
	});
});

//Comments CREATE
router.post("/", middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		} else{
			//render comments/new
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something went wrong");
					console.log(err)
				}
				else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Successfully added comment");
					res.redirect("/campgrounds/"+campground._id);
				}
			})
		}
	});
})

//Comments Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req,res){
	Campground.findById(req.params.id, function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error","No Campground found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			}
			else{
				res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
			}
		})
	})

})

//Comments Update
router.put("/:comment_id", middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){res.redirect("back");}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//Comments Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){res.redirect("back");}
		else{
			req.flash("success","Comment deleted");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

module.exports=router;

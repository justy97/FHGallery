const express=require("express");
const router = express.Router({mergeParams:true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");

//Comments NEW
router.get("/new", isLoggedIn, function(req,res){
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

//Comments CREATE
router.post("/",isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		} else{
			//render comments/new
				Comment.create(req.body.comment,function(err,comment){
				if(err){console.log(err)}
				else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment)
					campground.save()
					res.redirect("/campgrounds/"+campground._id)
				}
			})
		}
	});
})

//Comments Edit
router.get("/:comment_id/edit",checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){res.redirect("back");}
		else{
			res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
		}
	})
})

//Comments Update
router.put("/:comment_id",checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){res.redirect("back");}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//Comments Destroy Route
router.delete("/:comment_id",checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){res.redirect("back");}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect("/login");
	}
}

function checkCommentOwnership(req,res,next){
		if(req.isAuthenticated()){//if user is logged in:
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){res.redirect("back");}
			else{
				if(foundComment.author.id.equals(req.user._id)){//if the user owns the campground
					next();
				}
				else{
					res.redirect("back");
				}
			}
		})
	}
	else{
		//user not signed in
		res.redirect("back");
	}
}

module.exports=router;

var Campground = require("../models/campground");
var Comment = require("../models/comment");
//all the middlewares goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
	if(req.isAuthenticated()){//if user is logged in:
		Campground.findById(req.params.id,function(err,foundCampground){
			if(err || !foundCampground){
				req.flash("error","Campground not found");
				res.redirect("back");
			}
			else{
				//foundCampground.author.id is a Mongoose object, req.user._id is a String
				if(foundCampground.author.id.equals(req.user._id)){//if the user owns the campground
					next();
				}
				else{
					req.flash("error","Permission denied");
					res.redirect("back");
				}
			}
		})
	}
	else{
		req.flash("error","You need to be logged in");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){//if user is logged in:
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err || !foundComment){
				req.flash("error","Comment not found");
				res.redirect("back");
			}
			else{
				if(foundComment.author.id.equals(req.user._id)){//if the user owns the campground
					next();
				}
				else{
					req.flash("error","Permission denied");
					res.redirect("back");
				}
			}
		})
	}
	else{
		//user not signed in
		req.flash("error","You need to be logged in");
		res.redirect("back");
	}
}

//a middleware from youtube comment: help check Campground Id
middlewareObj.checkCampgroundId = function (req, res, next) {
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            req.flash("error", "Error: Campground not found...");
            res.redirect("back");
        } else {
            res.locals.foundCampground = campground;
            next();
        }
    });
};

module.exports = middlewareObj;
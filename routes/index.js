const express=require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

//index page
router.get("/",function(req,res){
	res.render("landing");
})


//=============AUTH ROUTES================

//Show register form
router.get("/register",function(req,res){
	res.render("register");
})

//Handle register Logic
router.post("/register",function(req,res){
	const newUser = new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			return res.redirect("/register")
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to YelpCamp "+user.username);
			res.redirect("/campgrounds")
		})
	})
})

//Show login form
router.get("/login",function(req,res){
	res.render("login");
})

//Handle Login Logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect:"/campgrounds",
		failureRedirect:"/login"
	}),function(req,res){
})

//Log Out
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out!");
	res.redirect("/campgrounds");
})

module.exports=router;
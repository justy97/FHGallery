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
			console.log(err);
			return res.render("register")
		}
		passport.authenticate("loca")(req,res,function(){
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
	res.redirect("/campgrounds");
})

//Middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect("/login");
	}
}

module.exports=router;
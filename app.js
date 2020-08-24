var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var campgrounds = [
	{name:"Salmon",image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
	{name:"Hill",image:"https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
	{name:"Woods",image:"https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
	{name:"Salmon",image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
	{name:"Hill",image:"https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
	{name:"Woods",image:"https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}
]

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.get("/",function(req,res){
	res.render("landing");
})

// RESTful convention #1
app.get("/campgrounds",function(req,res){
	res.render("campgrounds",{campgrounds:campgrounds});
})

// RESTful convention #2
app.get("/campgrounds/new",function(req,res){
	res.render("new.ejs");
})

// RESTful convention #3
app.post("/campgrounds",function(req,res){
// 	get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var newCamp = {name:name, image:image};
	campgrounds.push(newCamp);
// 	redirect back to campground page
	res.redirect("/campgrounds");
})

app.listen(3000,function(){
	console.log('The YelpCamp Server started on port 3000');
})
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var data = [
	{
		name:"Cloud",
		image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
	 	description:"This is an awesome camp"
	},
	{
		name:"Sky",
		image:"https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80",
	 	description:"MR BLUE SKY YEEEEEEEEEEEE"
	},
	{
		name:"Star",
		image:"https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
	 	description:"UR SKY UR SKY FULL OF STARRRRRRRR"
	}
]

function seedDB(){
	//Remove all campgrounds
	Campground.remove({},function(err){
		if(err){
			console.log(err);
		}
		console.log("romoved campgrounds!");
		Comment.remove({},function(err){
			if(err){
				console.log(err);
			}
			console.log("removed comments!");
			//Add a few campgrounds
			data.forEach(function(seed){
				Campground.create(seed,function(err,campground){
					if(err){console.log(err)}
					else{console.log("added a campground")}
					//create a comment
					Comment.create(
						{
							text:"This place is greeeeeeeeeeeeeeeatttttttt",
							author:"Harry"
						},function(err,comment){
							if(err){console.log(err)}
							else{
								campground.comments.push(comment);
								campground.save();
								console.log("Created new comment");
							}

						}
					)
				})
			})
		})

	})
	

}

module.exports = seedDB;

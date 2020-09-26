var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var data = [
	{
		name:"Dark PeaceKeeper",
		image:"https://res.cloudinary.com/tiandi/image/upload/v1601086774/qohuzbbcnjjpg0fxpbni.png",
	 	description:"PK in dark helm & cloth with gold lines. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec nisi risus. Sed at ligula sed justo consectetur rhoncus non sit amet sapien. Nam posuere sagittis nulla finibus tempor. Fusce arcu nunc, lobortis ut ullamcorper a, consectetur ut velit. In id ante id leo finibus aliquet. Morbi luctus, tortor non suscipit sodales, diam sem porta eros, vitae elementum tortor felis nec elit. In elementum lectus quis metus dignissim, quis sodales magna lobortis. Pellentesque maximus ullamcorper condimentum. Nulla facilisi. Quisque maximus lacus sed urna ullamcorper lobortis. Duis et quam ornare, tincidunt libero eget, ultricies ligula. Curabitur vehicula eleifend odio, id luctus velit posuere id. Curabitur egestas finibus arcu id blandit.",
		author:{
			id : "5f657a012c32ba0e23f1f222",
            username: "justy"
		}
	},
	{
		name:"Silver Tiandi",
		image:"https://res.cloudinary.com/tiandi/image/upload/v1601093071/Tiandi_sffcvg.png",
	 	description:"Shiny Shiny Tiandi",
		author:{
			id : "5f657a012c32ba0e23f1f222",
            username: "justy"
		}
	},
	{
		name:"Edgy Orochi",
		image:"https://res.cloudinary.com/tiandi/image/upload/v1601093070/Orochi_c5mqzo.png",
	 	description:"尋常に勝負！",
		author:{
			id : "5f657a012c32ba0e23f1f222",
            username: "justy"
		}
	}
]

function seedDB(){
	//Remove all campgrounds
	Campground.deleteMany({},function(err){
		if(err){
			console.log(err);
		}
		console.log("romoved campgrounds!");
		Comment.deleteMany({},function(err){
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
							text:"This Loadout is Great!",
							author:{
								id : "5f657a012c32ba0e23f1f222",
					            username: "justy"
							}
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

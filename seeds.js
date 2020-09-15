var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var data = [
	{
		name:"Cloud's Rest",
		image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
	 	description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec nisi risus. Sed at ligula sed justo consectetur rhoncus non sit amet sapien. Nam posuere sagittis nulla finibus tempor. Fusce arcu nunc, lobortis ut ullamcorper a, consectetur ut velit. In id ante id leo finibus aliquet. Morbi luctus, tortor non suscipit sodales, diam sem porta eros, vitae elementum tortor felis nec elit. In elementum lectus quis metus dignissim, quis sodales magna lobortis. Pellentesque maximus ullamcorper condimentum. Nulla facilisi. Quisque maximus lacus sed urna ullamcorper lobortis. Duis et quam ornare, tincidunt libero eget, ultricies ligula. Curabitur vehicula eleifend odio, id luctus velit posuere id. Curabitur egestas finibus arcu id blandit.",
		author:{
			id : "588c2e092403d111454fff76",
            username: "Jack"
		}
	},
	{
		name:"Sky",
		image:"https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80",
	 	description:"Curabitur auctor nunc arcu, nec faucibus leo dapibus et. Vestibulum fermentum maximus rutrum. Fusce vestibulum tempor ex, at faucibus sem maximus eget. Morbi vitae sodales mi. Phasellus sem odio, sollicitudin sit amet vestibulum quis, aliquet et erat. Donec vitae quam non nibh efficitur vehicula sit amet quis lacus. Aenean sit amet elementum ligula. Cras accumsan suscipit vulputate. Donec posuere tortor vitae vestibulum laoreet. Sed elit dolor, lobortis mollis cursus a, tempor ac velit. Maecenas dictum est ut ante interdum, ac pellentesque lectus malesuada. Suspendisse et sodales arcu, sed lobortis purus.",
		author:{
            id : "588c2e092403d111454fff71",
            username: "Jill"
        }
	},
	{
		name:"Star",
		image:"https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
	 	description:"Nulla nulla magna, congue id convallis sit amet, porta vitae diam. Praesent eget aliquam enim. Etiam in convallis ipsum. Praesent tortor nisl, imperdiet et lobortis maximus, vehicula a metus. Duis facilisis consectetur auctor. In maximus, erat sit amet interdum sollicitudin, est velit feugiat neque, sit amet luctus nisl metus a ipsum. Donec suscipit tellus sed bibendum congue. Mauris tempus ullamcorper est, ut posuere justo tristique at.",
		author:{
            id : "588c2e092403d111454fff77",
            username: "Jane"
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
							text:"This place is greeeeeeeeeeeeeeeatttttttt",
							author:{
                                    id : "588c2e092403d111454fff76",
                                    username: "Jack"
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

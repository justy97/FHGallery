# FHFashion: a Yelp-like Gallery Website
A gallery website aimed for users to post their *For Honor* character customization<br/>

## Demo
The current version: <https://fhfashion.herokuapp.com/>

## Features
* Authentication
    * ~~Sign up for new account via email confirmation~~
    * Register with custom username and password
    * User login with their username and password
* Authorization
* Manage Posts and Comments
    * Signed in users can **post** or **edit** their photos or comments as they like.
    * Users are **only** allowed to edit and delete their **own** photos or comments.
* Manage User accounts
* Flash messages for user notifications

## Downloading
> The API information of this app has been hidden deliberately, so the app cannot run as intended on your local machine.

### Processes
1. To download the files, run: <br/> ```git clone https://github.com/justy97/FHGallery.git ```
2. Install dependencies by running:<br/> ``` npm install ```<br/>or<br/> ```yarn install```


## Tech Stack
### Front-end
* ejs
* Boostrap 3
* jQuery

### Back-end
* Node.js
* Express
* mongoDB
* passport.js
* express-session
* cloudinary
* connect-flash

### Platforms
* [Cloudinary](https://cloudinary.com/)
* [Heroku](https://www.heroku.com/)
* [Cloud9](https://aws.amazon.com/cloud9/?origin=c9io)

## TODOS
    - Add post and comment time checking
    - Prevent multiple clicking submit
    - Make user profile page
    - Implement Drag & Upload
    - Make Image preview better before upload
    - Make new comment in show page
    - More Post Info: faction, character.
    - Add Image size check: upload and edit
    - Change Strucuture so that names are not yelpcamp.
    - Better safety: (Helmet?)
    - Search by name or category
    - Sort by most viewed, most/least recent
    - Add Administrator
    - Add rating? 
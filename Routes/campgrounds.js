var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
  
  //GET ALL CAMPGROUNDS TO INDEX PAGE 
  
  router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
      if(err){
        console.log(err);
      }else{
       res.render("campgrounds/index",{campgrounds:allCampgrounds});
      }
    });
  });
  
  //POST ALL CAMPGROUNDS TO DB AND REDIRECT TO CAMGROUNDS PAGE
  
  router.post("/",isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var description= req.body.description;
    var author = {
      id:req.user._id,
      username:req.user.username
     }
     var newCampground = {name :name,image:image,description:description,author:author}
  
    Campground.create(newCampground,function(err,newlyCreated){
      if(err){
          console.log(err);
      }else{
         res.redirect("/campgrounds");
      }
    }); 
  });
  
  //ADD NEW CAMPGROUND TEMPLATE
  
  router.get("/new", isLoggedIn,function(req,res){
  
  res.render("campgrounds/new");
  
  });
  
   //SHOW ALL CAMPGROUNDS ROUTE
  
  router.get("/:id",function(req,res){
     //find a campground with Provided ID
      Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
           console.log(err);
           }else{
          res.render("campgrounds/show",{campground:foundCampground});
        };
      });
   });

   //middleware 
  function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
  }
  
  module.exports = router;
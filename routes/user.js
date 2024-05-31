const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get('/user/:id', requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id }).select("-password")
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return Post.find({ postedby: user._id })
        .populate("postedby", "_id name")
        .then(posts => {
          
          res.json({ user, posts });
        });
    })
    .catch(err => {
      console.error("err in user/id"); // Log the error for debugging
      res.status(500).json({ error: "Internal server error" });
    });
});

router.put('/follow', requireLogin, (req, res) => {
  
  User.findByIdAndUpdate(req.body.followId, {
    $push: { following: req.user._id }
  }, { new: true })
    .then(result => {
      if (!result) {
        return res.status(422).json({ error: "Failed to follow the user" });
      }
      res.json(result);
    })   
    .catch(err => {
      console.error("err in follow");
      res.status(422).json({ error: err.message });
    });
});


router.put('/unfollow', requireLogin, (req, res) => {
  
  User.findByIdAndUpdate(req.body.followId, {
    $pull: { followers: req.user._id }
  }, { new: true })
    .then(result => {
      if (!result) {
        return res.status(422).json({ error: "Failed to unfollow the user" });
      }
      res.json(result);
    })   
    .catch(err => {
      console.error("err in unfollow");
      res.status(422).json({ error: err.message });
    });
});
module.exports = router;

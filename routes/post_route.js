const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const { route } = require("./authen");
const Post = mongoose.model("Post");

router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedby", "_id name")
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      console.log("err in allpost: ", err);
    });
});

router.get("/getsubscribpost", requireLogin, (req, res) => {
  //if posted by in following
  Post.find({ postedby: { $in: req.user.following } })
    .populate("postedby", "_id name")

    //only need id and name not all fields like passwork etc..
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      console.log("err in subscribed: ", err);
    });
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    console.log("pic is ", pic);
    return res.status(422).json({ message: "please add all of fields" });
  }
  // console.log("user is req", req.user);
  // res.send("Ok");
  req.user.password = undefined; /// so that our password not shown in db
  const post = new Post({
    title,
    body,
    photo: pic,
    postedby: req.user,
  });
  //console.log("post:::::",post);

  post
    .save()
    .then((result) => {
      //console.log("result in creat is:",result)
      res.json({ post: result });
    })
    .catch((err) => {
      console.log("err in create post ", err);
    });
  // console.log("post is:",req.user);
});

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedby: req.user._id })
    .populate("postedby", "_id name")
    .then((mypost) => {
      res.json({ mypost });
      // console.log("in my post");
    })
    .catch((err) => {
      console.log("err in mypost is", err);
    });
});
router.put("/like", requireLogin, (req, res) => {
  // Like a post
  const postId = req.body.postId;

  Post.findByIdAndUpdate(
    postId,
    {
      $push: { likes: req.user._id }, // Add user ID to likes array
    },
    { new: true }
  ) // Return the updated document
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(result);
    })
    .catch((err) => {
      console.error("Error in like post:", err);
      // Handle errors appropriately, e.g., send a proper error response
      return res.status(422).json({ error: err.message }); // Send a more informative error message
    });
});

router.put("/unlike", requireLogin, (req, res) => {
  // Like a post
  const postId = req.body.postId;

  Post.findByIdAndUpdate(
    postId,
    {
      $pull: { likes: req.user._id }, // Add user ID to likes array
    },
    { new: true }
  ) // Return the updated document
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Post not found in unlike" });
      }

      res.json(result);
    })
    .catch((err) => {
      // console.error("Error un liking post:", err);
      // Handle errors appropriately, e.g., send a proper error response
      return res.status(422).json({ error: err.message }); // Send a more informative error message
    });
});
router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedby: req.user,
    name: req.body.name,
  };
  const postId = req.body.postId;
  console.log("post id is", postId);
  Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment }, // Add user ID to likes array
    },
    { new: true }
  ) // Return the updated document
    .populate("postedby", "_id name")

    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Post not found in comment" });
      }
      res.json(result);
    })
    .catch((err) => {
      console.error("Error in comment:", err);
      // Handle errors appropriately, e.g., send a proper error response
      return res.status(422).json({ error: err.message }); // Send a more informative error message
    });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  const postId = req.params.postId;

  Post.findOneAndDelete({ _id: postId }) // Use findOneAndDelete
    .populate("postedby", "_id")
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.postedby._id.toString() === req.user._id.toString()) {
        console.log("posted id", post.postedby._id.toString());
        return res.status(401).json({ message: "Unauthorized" });
      }
      res.json(post); // Send the deleted post (if successful)
    })
    .catch((err) => {
      return res.status(422).json({ error: err.message }); // Send a more informative error message
    });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User"); //schemma
const bcyrpt = require("bcryptjs"); //hash password
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin");

const JWT_SECRET = process.env.JWT_SECRET;

console.log(JWT_SECRET)

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!email || !password || !name) {
    res.status(422).json({ error: "you will need to give all information" });
  }

  User.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "user already exists with that ID in sign in" });
    }

    bcyrpt.hash(password, 12).then((hashedpassword) => {
      const user = new User({
        email,
        password: hashedpassword, //hashing passwords
        name,
        pic,
      }); // get this https://cloud.mongodb.com/v2/663653bc9efd1b74f99f076a#/metrics/replicaSet/66365543cbbcec69fca0eafc/explorer/test/users/find
      user
        .save()
        .then((user) => {
          res.json({ message: "saved successfully" });
        })
        .catch((err) => {
          console.log("err in ", err);
        });
    });
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please add email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }
    bcyrpt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, followers, following, pic } = savedUser;
          res.json({
            token,
            user: { _id, name, email, followers, following, pic },
          });
        } else {
          return res.status(422).json({ error: "invalid password" });
        }
      })
      .catch((err) => {
        console.log("err in sig in is", err);
      });
  });
});

module.exports = router;

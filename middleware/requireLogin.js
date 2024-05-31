const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const JWT_SECRET = process.env.JWT_SECRET;

console.log(JWT_SECRET)

module.exports = (req, res, next) => {
  console.log("req.header is:", req.headers);
  const { authorization } = req.headers;
  console.log("authorization is ", authorization);
  if (!authorization) {
    res.status(401).json({ error: "you must be logged in" });
  }

  const token = authorization.replace("Bearer ", "");
  console.log("token is.......... ", token);
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be logged in....." });
    }
    console.log("hi ");
    const { _id } = payload;
    User.findById(_id).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
};

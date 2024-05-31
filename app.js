require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const PORT = 10054;

app.get("/", (req, res) => {
  res.send("hello");
});

const MONGO_URI = "mongodb+srv://Rimsha:u5D1lAwLkeZfHFih@cluster0.322tog9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("we are connected to the server i.e mongo db");
});

mongoose.connection.on("error", () => {
  console.log("we are not connected to the server i.e mongo db");
});

require("./models/user");
require("./models/post");
app.use(express.json());
app.use(require("./routes/authen"));
app.use(require("./routes/post_route"));
app.use(require("./routes/user"));

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }

app.listen(PORT);

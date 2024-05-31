const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGOURI } = require("./config/valuekeys.js");
const { Mongoose } = require("mongoose");
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("hello");
});
mongoose.connect(MONGOURI);

mongoose.connection.on("connected", () => {
  console.log("we are connected to the server i.e mongo db");
});

mongoose.connection.on("error", () => {
  console.log("we are not connected to the server i.e mongo db");
});

require("./models/user");
require("./models/post");
console.log("data in app.js");
app.use(express.json());
app.use(require("./routes/authen"));
app.use(require("./routes/post_route"));
app.use(require("./routes/user"));
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.listen(PORT, () => {
  console.log("server is running at port", PORT);
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
});

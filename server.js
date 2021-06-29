const express = require("express");
const bodyParser = require("body-parser");
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

mongoose.Promise = global.Promise;

mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Fail to connect to database");
    process.exit();
  });

app.get("/api/v1/index", (req, res) => {
  res.json({ message: "Smartlight Backend" });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

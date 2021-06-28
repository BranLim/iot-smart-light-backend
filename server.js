const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get("/api/v1/index", (req, res) => {
  res.json({ message: "Smartlight Backend" });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

import express, { Application, Request, Response } from "express";
import { dbConfig } from "./config/database.config";
import mongoose from "mongoose";
import routes from "./app/routes/lights-routes";

const app: Application = express();

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

app.use("/smartlights/", routes);

app.get("/api/v1/index", (req: Request, res: Response) => {
  res.json({ message: "Smartlight Backend" });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

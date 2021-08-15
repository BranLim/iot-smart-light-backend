import express from "express";
import bodyParser from "body-parser";
import lightController from "../controllers/light-controller";

const router = express.Router();

const jsonParser = bodyParser.json();

router.get("/api/v1/lights/config", jsonParser, lightController.lightConfig);

router.post(
  "/api/v1/lights/color",
  jsonParser,
  lightController.changeLightColor
);

router.post("/api/v1/lights", jsonParser, lightController.createLight);

export default router;

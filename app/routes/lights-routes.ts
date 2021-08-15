import express from "express";
import lightController from "../controllers/light-controller";


const router = express.Router();

router.get("/api/v1/lights/config", lightController.lightConfig);

router.post("/api/v1/lights/color", lightController.changeLightColor);

export default router;
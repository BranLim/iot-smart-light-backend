import { Request, Response } from "express";
import mongoose, { Mongoose } from "mongoose";
import Light from "../models/light";
import LightConfigDto from "../dtos/light-config-dto";
import LightUnitDto from "../dtos/light-config-dto";
import ILight from "../interfaces/light";
import ILightUnit from "../interfaces/light-unit";

const createLight = (req: Request, res: Response) => {
  const { name, ledCount } = req.body;

  const light = new Light({
    _id: new mongoose.Types.ObjectId(),
    name,
    ledCount,
  });
  
  light
    .save()
    .then(() => {
      res.status(200).json({
        message: "Light created",
      });
    })
    .catch((error) => {
      res.status(500).json({
        error,
        message: "No light created.",
      });
    });
};

const changeLightColor = (req: Request, res: Response) => {
  const { name, lightColor } = req.body;

  res.status(200).send();
};

const lightConfig = (req: Request, res: Response) => {
  Light.findOne({}, (err: mongoose.CallbackError, light: ILight) => {
    if (err) {
      return res.status(500).json({ err, message: "Cannot read light config" });
    }
    if (!light) {
      return res.status(404).json({ message: "No light configuration found" });
    }
    if (isLightUnit(light.leds)) {
      const led = light.leds as ILightUnit;

      const config: LightConfigDto = {
        pixels: [
          {
            red: led.red,
            green: led.green,
            blue: led.blue,
          },
        ],
      };
      res.status(200).json(config);
    } else {
    }
  });
};

const isLightUnit = (obj: ILightUnit | any): obj is ILightUnit => {
  return obj && obj.name && typeof obj.name === "string";
};

const lightController = { createLight, changeLightColor, lightConfig };

export default lightController;

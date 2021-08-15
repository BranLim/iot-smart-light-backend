import { Request, Response } from "express";
import mongoose, { Mongoose } from "mongoose";
import Light from "../models/light";
import LightConfigDto from "../dtos/light-config-dto";
import LightUnitDto from "../dtos/light-config-dto";
import ILight from "../interfaces/light";
import ILightUnit from "../interfaces/light-unit";

const createLight = (req: Request, res: Response) => {
  const { name, ledCount } = req.body || {};

  console.log("Name: " + name + " Led Count: " + ledCount);
  const light = new Light({
    _id: new mongoose.Types.ObjectId(),
    name: name,
    pixelCount: ledCount,
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
  console.log("Retrieving Light Configuration");

  Light.findOne({}, (err: mongoose.CallbackError, light: ILight) => {
    if (err) {
      return res.status(500).json({ err, message: "Cannot read light config" });
    }
    if (!light) {
      return res.status(404).json({ message: "No light configuration found" });
    }

    console.log(light);
    console.log(light.pixels);
    if (!light.pixels) {
      res.status(500).json({ message: "Cannot retrieve light configuration" });
    }

    if (isLightUnit(light.pixels)) {
      const led = light.pixels as ILightUnit;

      const config: LightConfigDto = {
        name: light.name,
        pixels: [
          {
            red: led.red,
            green: led.green,
            blue: led.blue,
          },
        ],
      };
      return res.status(200).json(config);
    }

    const leds = light.pixels as ILightUnit[];

    const config: LightConfigDto = {
      name: light.name,
    };
    return res.status(200).json(config);
  });
};

const isLightUnit = (obj: ILightUnit | any): obj is ILightUnit => {
  return obj && obj.name && typeof obj.name === "string";
};

const lightController = { createLight, changeLightColor, lightConfig };

export default lightController;

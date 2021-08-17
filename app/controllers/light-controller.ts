import { Request, Response } from "express";
import mongoose, { Mongoose } from "mongoose";
import Light from "../models/light";
import LightConfigDto from "../dtos/light-config-dto";
import LightUnitDto from "../dtos/light-config-dto";
import ILight from "../interfaces/light";
import ILightUnit from "../interfaces/light-unit";

const createLight = (req: Request, res: Response) => {
  const request: { name: string; ledCount: number } = req.body || {};

  console.log("Name: " + request.name + " Led Count: " + request.ledCount);

  const light = new Light({
    id: new mongoose.Types.ObjectId(),
    name: request.name,
    pixelCount: request.ledCount,
    pixels: [],
  });

  light
    .save()
    .then(() => {
      res.status(200).json({
        message: "Light created",
        objectId: light.id,
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
  const lightConfig: LightConfigDto = req.body;
  console.log(lightConfig);
  if (!lightConfig) {
    return res.status(400).send({ message: "Missing request body" });
  }

  const pixelsToUpdate: ILightUnit[] =
    lightConfig.pixels?.map((led) => {
      const pixel = {
        type: "NeoPixel",
        red: led.red || NaN,
        green: led.green || NaN,
        blue: led.blue || NaN,
      };
      return pixel;
    }) || [];

  Light.findOne(
    { id: lightConfig.id },
    (err: mongoose.CallbackError, light: ILight & mongoose.Document) => {
      if (!light) {
        return res.status(404).send({ message: "No light found." });
      }
      if (err) {
        return res.status(500).send({ message: "Error finding light." });
      }
      light.pixels = pixelsToUpdate;
      light.save();
      res.status(200).send({ message: "Light color updated." });
    }
  );
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

    if (!light.pixels) {
      return res
        .status(500)
        .json({ message: "Cannot retrieve light configuration" });
    }

    const pixels: LightUnitDto[] = [];

    if (isLightUnit(light.pixels)) {
      const led = light.pixels as ILightUnit;
      pixels.push({
        red: led.red,
        green: led.green,
        blue: led.blue,
      });
    } else {
      const leds = light.pixels as ILightUnit[];

      leds.forEach((led) => {
        const lightUnit: LightUnitDto = {
          red: led.red,
          green: led.green,
          blue: led.blue,
        };
        pixels.push(lightUnit);
      });
    }

    const config: LightConfigDto = {
      id: light.id,
      name: light.name,
      pixels: pixels,
    };
    return res.status(200).json(config);
  });
};

const isLightUnit = (obj: ILightUnit | any): obj is ILightUnit => {
  return obj && obj.name && typeof obj.name === "string";
};

const lightController = { createLight, changeLightColor, lightConfig };

export default lightController;

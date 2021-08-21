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
    brightness: 50,
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

const turnOn = (req: Request, res: Response) => {
  const stateRequest: { id: string } = req.body || {};
  if (!stateRequest) {
    return res.status(400).json({ message: "Missing request body" });
  }
  changeLightState(stateRequest.id, 1, res);
};

const turnOff = (req: Request, res: Response) => {
  const stateRequest: { id: string } = req.body || {};
  if (!stateRequest) {
    return res.status(400).json({ message: "Missing request body" });
  }
  changeLightState(stateRequest.id, 0, res);
};

const changeLightState = (lightId: string, state: number, res: Response) => {
  Light.findOne(
    { id: lightId },
    (err: mongoose.CallbackError, light: ILight & mongoose.Document) => {
      if (!light) {
        return res.status(404).send({ message: "No light found." });
      }
      if (err) {
        return res.status(500).send({ message: "Error finding light." });
      }
      light.state = state;
      light.save();
      res
        .status(200)
        .send({ message: state ? "Light turned on." : "Light turned off." });
    }
  );
};

const changeBrightness = (req: Request, res: Response) => {
  const brightnessRequest: { id: string; brightness: number } = req.body || {};
  if (!brightnessRequest) {
    return res.status(400).json({ message: "Missing request body" });
  }
  Light.findOne(
    { id: brightnessRequest.id },
    (err: mongoose.CallbackError, light: ILight & mongoose.Document) => {
      if (!light) {
        return res.status(404).send({ message: "No light found." });
      }
      if (err) {
        return res.status(500).send({ message: "Error finding light." });
      }
      light.brightness = brightnessRequest.brightness;
      light.save();
      res.status(200).send({ message: "Light brightness updated." });
    }
  );
};

const changeLightColor = (req: Request, res: Response) => {
  const lightConfig: LightConfigDto = req.body;
  console.log(lightConfig);
  if (!lightConfig) {
    return res.status(400).json({ message: "Missing request body" });
  }

  const pixelsToUpdate: ILightUnit[] =
    lightConfig.pixels?.map((led) => {
      const pixel = {
        type: "NeoPixel",
        red: led.red || 0,
        green: led.green || 0,
        blue: led.blue || 0,
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
      brightness: light.brightness,
      state: light.state,
      pixels: pixels,
    };
    return res.status(200).json(config);
  });
};

const isLightUnit = (obj: ILightUnit | any): obj is ILightUnit => {
  return obj && obj.name && typeof obj.name === "string";
};

const lightController = {
  createLight,
  changeBrightness,
  changeLightColor,
  lightStatus: lightConfig,
  turnOff,
  turnOn,
};

export default lightController;

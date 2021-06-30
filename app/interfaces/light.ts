import { Document } from "mongoose";
import ILightUnit from "./light-unit";

export default interface ILight extends Document {
  name: string;
  ledCount: number;
  leds: ILightUnit[] | ILightUnit;
}

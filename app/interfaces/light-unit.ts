import { Document } from "mongoose";

export default interface ILightUnit extends Document {
  type: String;
  red: number;
  green: number;
  blue: number;
}

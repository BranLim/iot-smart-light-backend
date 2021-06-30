import mongoose, { Schema } from "mongoose";
import ILight from "../interfaces/light";
import LightUnit from "../models/light-unit";

const LightSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    pixelCount: { type: Number, required: true },
    pixels: { type: [LightUnit], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILight>("Light", LightSchema);

import mongoose, { Schema } from "mongoose";
import ILight from "../interfaces/light";
import LightUnit from "../models/light-unit";

const LightSchema: Schema<ILight> = new Schema<ILight>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    pixelCount: { type: Number, required: true },
    pixels: { type: [LightUnit.schema], required: false },
  },
  { timestamps: true }
);

export default mongoose.model<ILight>("Light", LightSchema);

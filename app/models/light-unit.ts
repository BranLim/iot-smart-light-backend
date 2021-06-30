import mongoose, { Schema } from "mongoose";
import ILightUnit from "../interfaces/light-unit";

const LightUnitSchema = new Schema({
  type: { type: String, required: true },
  red: { type: Number, required: true },
  green: { type: Number, required: true },
  blue: { type: Number, required: true },
});

export default mongoose.model<ILightUnit>("LightUnit", LightUnitSchema);

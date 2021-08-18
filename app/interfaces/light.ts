import ILightUnit from "./light-unit";

export default interface ILight {
  id: string;
  name: string;
  pixelCount: number;
  brightness: number;
  state: number;
  pixels: ILightUnit[] | ILightUnit;
}

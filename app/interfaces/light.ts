import ILightUnit from "./light-unit";

export default interface ILight {
  id: string;
  name: string;
  pixelCount: number;
  pixels: ILightUnit[] | ILightUnit;
}

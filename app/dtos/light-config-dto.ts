export default interface LightUnitDto {
  red?: number;
  green?: number;
  blue?: number;
}

export default interface LightConfigDto {
  id?: string;
  name?: string;
  pixels?: LightUnitDto[];
}

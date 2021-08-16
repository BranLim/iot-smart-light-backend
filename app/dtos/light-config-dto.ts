export default interface LightUnitDto {
  red?: number;
  green?: number;
  blue?: number;
}

export default interface LightConfigDto {
  name?: string;
  pixels?: LightUnitDto[];
}

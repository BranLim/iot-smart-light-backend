export default interface LightUnitDto {
  red?: number;
  green?: number;
  blue?: number;
}

export default interface LightConfigDto {
  pixels?: [LightUnitDto] ;
}

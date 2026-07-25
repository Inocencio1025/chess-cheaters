export type TerrainType =
  | "rock";

export type Terrain = {
  [square: string]: TerrainType | null;
};
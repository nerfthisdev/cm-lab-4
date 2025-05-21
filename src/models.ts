export interface Point {
  x: number;
  y: number;
}

export interface ApproximationResult {
  name: string;
  formula: string;
  predict: (x: number) => number;
  s: number;
  sigma: number;
  r2?: number;
  r?: number; //for linear
}

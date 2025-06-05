import {
  sum,
  sumProduct,
  sumSquares,
  pearsonCorrelation,
  determinationCoefficient,
} from "../utils";
import { ApproximationResult } from "../models";

export function linear(x: number[], y: number[]): ApproximationResult {
  const n = x.length;
  const sumX = sum(x);
  const sumY = sum(y);
  const sumXY = sumProduct(x, y);
  const sumXX = sumSquares(x);

  // Крамер
  const a = (n * sumXY - sumX * sumY) / (n * sumXX - sumX ** 2);
  const b = (sumXX * sumY - sumX * sumXY) / (n * sumXX - sumX ** 2);

  const predict = (xVal: number) => a * xVal + b;
  const yApprox = x.map(predict);

  const s = sum(y.map((yi, i) => (yi - yApprox[i]) ** 2));
  const sigma = Math.sqrt(s / n);
  const r = pearsonCorrelation(x, y);
  const r2 = determinationCoefficient(y, yApprox);

  return {
    name: "Линейная",
    formula: `y = ${a.toFixed(4)}x + ${b.toFixed(4)}`,
    predict,
    s,
    sigma,
    r,
    r2,
  };
}

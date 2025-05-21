import { ApproximationResult } from "../models";
import { determinationCoefficient, sum } from "../utils";

export function exponential(x: number[], y: number[]): ApproximationResult {
  const lnY = y.map(Math.log);
  const n = x.length;

  const sumX = sum(x);
  const sumLnY = sum(lnY);
  const sumX2 = sum(x.map((val) => val ** 2));
  const sumXLnY = sum(x.map((xi, i) => xi * lnY[i]));

  const b = (n * sumXLnY - sumX * sumLnY) / (n * sumX2 - sumX ** 2);
  const lnA = (sumLnY - b * sumX) / n;
  const a = Math.exp(lnA);

  const predict = (xVal: number) => a * Math.exp(b * xVal);
  const yApprox = x.map(predict);
  const s = sum(y.map((yi, i) => (yi - yApprox[i]) ** 2));
  const sigma = Math.sqrt(s / n);
  const r2 = determinationCoefficient(y, yApprox);

  return {
    name: "Экспоненциальная",
    formula: `y = ${a.toFixed(4)} * e^(${b.toFixed(4)}x)`,
    predict,
    s,
    sigma,
    r2,
  };
}

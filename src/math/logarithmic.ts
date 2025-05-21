import { ApproximationResult } from "../models";
import { determinationCoefficient, sum } from "../utils";

export function logarithmic(x: number[], y: number[]): ApproximationResult {
  const lnX = x.map(Math.log);
  const n = x.length;

  const sumLnX = sum(lnX);
  const sumY = sum(y);
  const sumLnX2 = sum(lnX.map((val) => val ** 2));
  const sumLnXY = sum(lnX.map((xi, i) => xi * y[i]));

  const a = (n * sumLnXY - sumLnX * sumY) / (n * sumLnX2 - sumLnX ** 2);
  const b = (sumY - a * sumLnX) / n;

  const predict = (xVal: number) => a * Math.log(xVal) + b;
  const yApprox = x.map(predict);
  const s = sum(y.map((yi, i) => (yi - yApprox[i]) ** 2));
  const sigma = Math.sqrt(s / n);
  const r2 = determinationCoefficient(y, yApprox);

  return {
    name: "Логарифмическая",
    formula: `y = ${a.toFixed(4)} * ln(x) + ${b.toFixed(4)}`,
    predict,
    s,
    sigma,
    r2,
  };
}

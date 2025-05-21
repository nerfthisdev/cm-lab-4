import { ApproximationResult } from "../models";
import { determinationCoefficient, sum } from "../utils";

export function power(x: number[], y: number[]): ApproximationResult {
  const lnX = x.map(Math.log);
  const lnY = y.map(Math.log);
  const n = x.length;

  const sumLnX = sum(lnX);
  const sumLnY = sum(lnY);
  const sumLnX2 = sum(lnX.map((val) => val ** 2));
  const sumLnXLnY = sum(lnX.map((xi, i) => xi * lnY[i]));

  const b = (n * sumLnXLnY - sumLnX * sumLnY) / (n * sumLnX2 - sumLnX ** 2);
  const a = Math.exp((sumLnY - b * sumLnX) / n);

  const predict = (xVal: number) => a * xVal ** b;
  const yApprox = x.map(predict);
  const s = sum(y.map((yi, i) => (yi - yApprox[i]) ** 2));
  const sigma = Math.sqrt(s / n);
  const r2 = determinationCoefficient(y, yApprox);

  return {
    name: "Степенная",
    formula: `y = ${a.toFixed(4)} * x^${b.toFixed(4)}`,
    predict,
    s,
    sigma,
    r2,
  };
}

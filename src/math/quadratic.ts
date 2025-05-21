import { ApproximationResult } from "../models";
import {
  determinationCoefficient,
  solveLinearSystem,
  sum,
  sumProduct,
} from "../utils";

export function quadratic(x: number[], y: number[]): ApproximationResult {
  const n = x.length;

  const sumX = sum(x);
  const sumX2 = sum(x.map((xi) => xi ** 2));
  const sumX3 = sum(x.map((xi) => xi ** 3));
  const sumX4 = sum(x.map((xi) => xi ** 4));
  const sumY = sum(y);
  const sumXY = sumProduct(x, y);
  const sumX2Y = sum(x.map((xi, i) => xi ** 2 * y[i]));

  const A = [
    [n, sumX, sumX2],
    [sumX, sumX2, sumX3],
    [sumX2, sumX3, sumX4],
  ];
  const B = [sumY, sumXY, sumX2Y];

  const [a0, a1, a2] = solveLinearSystem(A, B);

  const predict = (xVal: number) => a0 + a1 * xVal + a2 * xVal ** 2;
  const yApprox = x.map(predict);
  const s = sum(y.map((yi, i) => (yi - yApprox[i]) ** 2));
  const sigma = Math.sqrt(s / n);
  const r2 = determinationCoefficient(y, yApprox);

  return {
    name: "Квадратичная",
    formula: `y = ${a0.toFixed(4)} + ${a1.toFixed(4)}x + ${a2.toFixed(4)}x²`,
    predict,
    s,
    sigma,
    r2,
  };
}

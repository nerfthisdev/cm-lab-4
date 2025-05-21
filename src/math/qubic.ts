import { ApproximationResult } from "../models";
import { determinationCoefficient, solveLinearSystem, sum } from "../utils";

// Кубическая: y = a0 + a1*x + a2*x^2 + a3*x^3
export function cubic(x: number[], y: number[]): ApproximationResult {
  const n = x.length;

  const sumX = sum(x);
  const sumX2 = sum(x.map((xi) => xi ** 2));
  const sumX3 = sum(x.map((xi) => xi ** 3));
  const sumX4 = sum(x.map((xi) => xi ** 4));
  const sumX5 = sum(x.map((xi) => xi ** 5));
  const sumX6 = sum(x.map((xi) => xi ** 6));
  const sumY = sum(y);
  const sumXY = sum(x.map((xi, i) => xi * y[i]));
  const sumX2Y = sum(x.map((xi, i) => xi ** 2 * y[i]));
  const sumX3Y = sum(x.map((xi, i) => xi ** 3 * y[i]));

  const A = [
    [n, sumX, sumX2, sumX3],
    [sumX, sumX2, sumX3, sumX4],
    [sumX2, sumX3, sumX4, sumX5],
    [sumX3, sumX4, sumX5, sumX6],
  ];
  const B = [sumY, sumXY, sumX2Y, sumX3Y];

  const [a0, a1, a2, a3] = solveLinearSystem(A, B);
  const predict = (xVal: number) =>
    a0 + a1 * xVal + a2 * xVal ** 2 + a3 * xVal ** 3;
  const yApprox = x.map(predict);
  const s = sum(y.map((yi, i) => (yi - yApprox[i]) ** 2));
  const sigma = Math.sqrt(s / n);
  const r2 = determinationCoefficient(y, yApprox);

  return {
    name: "Кубическая",
    formula: `y = ${a0.toFixed(4)} + ${a1.toFixed(4)}x + ${a2.toFixed(4)}x² + ${a3.toFixed(4)}x³`,
    predict,
    s,
    sigma,
    r2,
  };
}

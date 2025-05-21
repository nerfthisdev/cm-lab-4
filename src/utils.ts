export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

export function sumProduct(x: number[], y: number[]): number {
  return x.reduce((acc, xi, i) => acc + xi * y[i], 0);
}

export function sumSquares(arr: number[]): number {
  return arr.reduce((acc, xi) => acc + xi * xi, 0);
}

export function mean(arr: number[]): number {
  return sum(arr) / arr.length;
}

export function pearsonCorrelation(x: number[], y: number[]): number {
  const xBar = mean(x);
  const yBar = mean(y);
  const numerator = sum(x.map((xi, i) => (xi - xBar) * (y[i] - yBar)));
  const denominator = Math.sqrt(
    sum(x.map((xi) => (xi - xBar) ** 2)) * sum(y.map((yi) => (yi - yBar) ** 2)),
  );
  return numerator / denominator;
}

export function determinationCoefficient(
  y: number[],
  yApprox: number[],
): number {
  const yMean = mean(y);
  const ssTot = sum(y.map((yi) => (yi - yMean) ** 2));
  const ssRes = sum(y.map((yi, i) => (yi - yApprox[i]) ** 2));
  return 1 - ssRes / ssTot;
}

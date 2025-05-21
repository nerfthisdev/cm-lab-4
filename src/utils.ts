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

export function solveLinearSystem(A: number[][], B: number[]): number[] {
  const n = A.length;
  const matrix = A.map((row, i) => [...row, B[i]]); // Расширяем матрицу (добавляем B как последний столбец)

  // Прямой ход Гаусса
  for (let i = 0; i < n; i++) {
    // Поиск максимального элемента по столбцу (для устойчивости)
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) {
        maxRow = k;
      }
    }

    // Обмен строк
    [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];

    // Нормализация строки
    const pivot = matrix[i][i];
    if (pivot === 0) throw new Error("Система не имеет единственного решения");
    for (let j = i; j <= n; j++) {
      matrix[i][j] /= pivot;
    }

    // Обнуление под текущим элементом
    for (let k = i + 1; k < n; k++) {
      const factor = matrix[k][i];
      for (let j = i; j <= n; j++) {
        matrix[k][j] -= factor * matrix[i][j];
      }
    }
  }

  // Обратный ход
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = matrix[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= matrix[i][j] * x[j];
    }
  }

  return x;
}

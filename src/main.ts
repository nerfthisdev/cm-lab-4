import readlineSync from "readline-sync";
import { linear } from "./math/linear";
import { ApproximationResult, Point } from "./models";
import { exponential } from "./math/exponential";
import { logarithmic } from "./math/logarithmic";
import { quadratic } from "./math/quadratic";
import { cubic } from "./math/cubic";
import { power } from "./math/power";
import { readPointsFromFile } from "./io/readInput";
import { createComparisonGraph } from "./graph";
function describeCorrelation(r: number): string {
  if (Math.abs(r) >= 0.9) return "весьма высокая связь";
  if (Math.abs(r) >= 0.7) return "высокая связь";
  if (Math.abs(r) >= 0.5) return "заметная связь";
  if (Math.abs(r) >= 0.3) return "слабая связь";
  return "связь отсутствует";
}

function describeDetermination(r2: number): string {
  if (r2 >= 0.95) return "модель описывает процесс с высокой точностью";
  if (r2 >= 0.75) return "модель описывает процесс удовлетворительно";
  if (r2 >= 0.5) return "модель описывает процесс слабо";
  return "модель описывает процесс неудовлетворительно";
}

function readPointsFromUser(): Point[] {
  const n = readlineSync.questionInt("Сколько точек (8-12): ");
  const points: Point[] = [];

  for (let i = 0; i < n; i++) {
    const x = readlineSync.questionFloat(`x[${i + 1}]: `);
    const y = readlineSync.questionFloat(`y[${i + 1}]: `);
    points.push({ x, y });
  }

  return points;
}

function main() {
  let points: Point[] = [];

  const fromFile = readlineSync
    .question("Считать точки из файла? (да/нет): ")
    .toLowerCase();
  if (fromFile === "да") {
    const filePath = readlineSync.question("Укажите путь к файлу: ");
    points = readPointsFromFile(filePath);
  } else {
    points = readPointsFromUser();
  }

  const x = points.map((p) => p.x);
  const y = points.map((p) => p.y);

  const hasNegativeX = x.some((v) => v <= 0);
  const hasNegativeY = y.some((v) => v <= 0);

  console.log("\n[Информация о данных]");
  if (hasNegativeX)
    console.log(
      "⚠️ В данных есть x <= 0 — логарифмическая и степенная аппроксимации недопустимы",
    );
  if (hasNegativeY)
    console.log(
      "⚠️ В данных есть y <= 0 — экспоненциальная и степенная аппроксимации недопустимы",
    );

  const allYEqual = y.every((val) => val === y[0]);
  if (allYEqual) {
    console.log("\nВсе значения y равны. Функция постоянна: y = " + y[0]);
    console.log("Единственная адекватная аппроксимация — y = " + y[0]);

    createComparisonGraph(
      x,
      y,
      [
        {
          name: "Constant",
          formula: `y = ${y[0]}`,
          s: 0,
          sigma: 0,
          r2: 1,
          predict: (_) => y[0],
        },
      ],
      "comparison.html",
    );
    console.log("График сохранен в comparison.html");
    return;
  }

  const results: ApproximationResult[] = [
    linear(x, y),
    quadratic(x, y),
    cubic(x, y),
    ...(hasNegativeX ? [] : [logarithmic(x, y)]),
    ...(hasNegativeX || hasNegativeY ? [] : [power(x, y)]),
    ...(hasNegativeY ? [] : [exponential(x, y)]),
  ];

  results.forEach((r) => {
    console.log(`\n--- ${r.name} ---`);
    console.log(`Формула: ${r.formula}`);
    console.log(`S = ${r.s.toFixed(4)}, σ = ${r.sigma.toFixed(4)}`);
    if (r.r !== undefined) {
      console.log(`r = ${r.r.toFixed(4)} — ${describeCorrelation(r.r)}`);
    }
    if (r.r2 !== undefined) {
      console.log(`R² = ${r.r2.toFixed(4)} — ${describeDetermination(r.r2)}`);
    }
  });

  createComparisonGraph(x, y, results, "comparison.html");
  console.log("График сохранен в comparison.html");

  const best = results.reduce((min, curr) =>
    curr.sigma < min.sigma ? curr : min,
  );
  console.log(`\nНаилучшее приближение: ${best.name}`);

  const showTable = readlineSync.question(
    "Вывести таблицу значений? (да/нет): ",
  );
  if (showTable.toLowerCase() === "да") {
    console.log(`\nТаблица для функции: ${best.name}`);
    console.log(" x       | f(x)    | φ(x)    | ε       ");
    console.log("----------------------------------------");
    x.forEach((xi, i) => {
      const actual = y[i];
      const approx = best.predict(xi);
      const eps = approx - actual;
      console.log(
        `${xi.toFixed(4).padEnd(8)} | ${actual.toFixed(4).padEnd(8)} | ${approx
          .toFixed(4)
          .padEnd(8)} | ${eps.toFixed(4).padEnd(8)}`,
      );
    });
  }
}

main();

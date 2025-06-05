import fs from "fs";
import { ApproximationResult } from "./models";

export function createComparisonGraph(
  x: number[],
  y: number[],
  results: ApproximationResult[],
  filename: string
) {
  const minX = Math.min(...x);
  const maxX = Math.max(...x);
  const steps = 100;
  const xCurve = Array.from(
    { length: steps },
    (_, i) => minX + ((maxX - minX) * i) / (steps - 1)
  );

  const traces = results.map((r) => ({
    x: xCurve,
    y: xCurve.map((xi) => r.predict(xi)),
    mode: "lines",
    type: "scatter",
    name: r.name,
  }));

  const tracePoints = {
    x,
    y,
    mode: "markers",
    type: "scatter",
    name: "Исходные данные",
  };

  const data = [tracePoints, ...traces];

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head>
<body>
<div id="plot" style="width:800px;height:600px;"></div>
<script>
  const data = ${JSON.stringify(data)};
  const layout = { title: 'Сравнение методов', xaxis: { title: 'x' }, yaxis: { title: 'y' } };
  Plotly.newPlot('plot', data, layout);
</script>
</body>
</html>`;

  fs.writeFileSync(filename, html, "utf-8");
}

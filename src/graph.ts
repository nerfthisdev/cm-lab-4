import fs from "fs";
import { ApproximationResult } from "./models";

export function createApproximationGraph(
  x: number[],
  y: number[],
  result: ApproximationResult,
  filename: string,
) {
  const minX = Math.min(...x);
  const maxX = Math.max(...x);
  const steps = 100;
  const xCurve = Array.from({ length: steps }, (_, i) =>
    minX + ((maxX - minX) * i) / (steps - 1),
  );
  const yCurve = xCurve.map((xi) => result.predict(xi));

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head>
<body>
<div id="plot" style="width:600px;height:400px;"></div>
<script>
  const tracePoints = {
    x: ${JSON.stringify(x)},
    y: ${JSON.stringify(y)},
    mode: 'markers',
    type: 'scatter',
    name: 'Исходные данные'
  };
  const traceApprox = {
    x: ${JSON.stringify(xCurve)},
    y: ${JSON.stringify(yCurve)},
    mode: 'lines',
    type: 'scatter',
    name: '${result.name}'
  };
  const data = [tracePoints, traceApprox];
  const layout = { title: '${result.name}', xaxis: { title: 'x' }, yaxis: { title: 'y' } };
  Plotly.newPlot('plot', data, layout);
</script>
</body>
</html>`;

  fs.writeFileSync(filename, html, "utf-8");
}

import fs from "fs";
import { Point } from "../models";

export function readPointsFromFile(path: string): Point[] {
  const content = fs.readFileSync(path, "utf-8");
  const lines = content.trim().split("\n");
  if (lines.length < 2)
    throw new Error("Файл должен содержать как минимум 2 строки.");

  const x = lines[0].trim().split(/\s+/).map(Number);
  const y = lines[1].trim().split(/\s+/).map(Number);

  if (x.length !== y.length)
    throw new Error("Количество X и Y должно совпадать.");

  return x.map((xi, i) => ({ x: xi, y: y[i] }));
}

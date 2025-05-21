import fs from "fs";

export function readXYFromFile(filePath: string): { x: number[]; y: number[] } {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.trim().split("\n");

  if (lines.length < 2)
    throw new Error("Файл должен содержать как минимум две строки.");

  const x = lines[0].trim().split(/\s+/).map(Number);
  const y = lines[1].trim().split(/\s+/).map(Number);

  if (x.length !== y.length) {
    throw new Error("Количество X и Y должно совпадать.");
  }

  return { x, y };
}

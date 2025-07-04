export function generateCheckerboard(size: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size * 2;
  canvas.height = size * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#020202";
  ctx.fillRect(0, 0, size, size);
  ctx.fillRect(size, size, size, size);
  ctx.fillStyle = "#010101";
  ctx.fillRect(size, 0, size, size);
  ctx.fillRect(0, size, size, size);
  return canvas;
}

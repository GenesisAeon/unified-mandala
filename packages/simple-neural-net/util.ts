export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function meanSquareLoss(targets: number[], predictions: number[]): number {
  let sum = 0;
  for (let i = 0; i < targets.length; i++) {
    const error = targets[i] - predictions[i];
    sum += error * error;
  }
  return sum / targets.length;
}

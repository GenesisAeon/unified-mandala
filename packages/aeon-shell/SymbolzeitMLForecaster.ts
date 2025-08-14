/**
 * Basic Symbolzeit forecaster using linear regression over a numeric history.
 *
 * The model treats each entry in the history as a sequential time step and
 * fits a simple y = ax + b line. The next Symbolzeit value is predicted by
 * extrapolating this line.
 */
export class SymbolzeitMLForecaster {
  private slope = 0;
  private intercept = 0;
  private length = 0;

  /**
     * Train the model using a sequence of Symbolzeit values.
     * @param history Array of numeric Symbolzeit values ordered by time.
     */
  train(history: number[]): void {
    this.length = history.length;
    if (this.length === 0) {
      this.slope = 0;
      this.intercept = 0;
      return;
    }

    const xMean = (this.length - 1) / 2;
    const yMean = history.reduce((a, b) => a + b, 0) / this.length;

    let num = 0;
    let den = 0;
    history.forEach((y, i) => {
      const dx = i - xMean;
      num += dx * (y - yMean);
      den += dx * dx;
    });
    this.slope = den === 0 ? 0 : num / den;
    this.intercept = yMean - this.slope * xMean;
  }

  /**
     * Forecast the next Symbolzeit value.
     */
  forecastNext(): number {
    const nextIndex = this.length;
    return this.slope * nextIndex + this.intercept;
  }
}

/**
 * Convenience helper to forecast next Symbolzeit value from a history array.
 */
export function forecastSymbolzeit(history: number[]): number {
  const forecaster = new SymbolzeitMLForecaster();
  forecaster.train(history);
  return forecaster.forecastNext();
}


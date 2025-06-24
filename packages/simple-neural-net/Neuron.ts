export class Neuron {
  private random = Math.random;

  private oldBias: number = this.random() * 2 - 1;
  private bias: number = this.random() * 2 - 1;

  public oldWeight1: number = this.random() * 2 - 1;
  public weight1: number = this.random() * 2 - 1;

  private oldWeight2: number = this.random() * 2 - 1;
  private weight2: number = this.random() * 2 - 1;

  compute(input1: number, input2: number, activation: (x: number) => number): number {
    const preActivation = (this.weight1 * input1) + (this.weight2 * input2) + this.bias;
    return activation(preActivation);
  }

  mutate() {
    const prop = Math.floor(this.random() * 3);
    const change = this.random() * 2 - 1;
    if (prop === 0) {
      this.bias += change;
    } else if (prop === 1) {
      this.weight1 += change;
    } else {
      this.weight2 += change;
    }
  }

  forget() {
    this.bias = this.oldBias;
    this.weight1 = this.oldWeight1;
    this.weight2 = this.oldWeight2;
  }

  remember() {
    this.oldBias = this.bias;
    this.oldWeight1 = this.weight1;
    this.oldWeight2 = this.weight2;
  }
}

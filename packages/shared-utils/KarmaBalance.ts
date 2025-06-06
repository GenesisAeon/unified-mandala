export class KarmaBalance {
  private balance = 0;

  add(points: number) {
    this.balance += points;
  }

  getBalance() {
    return this.balance;
  }
}

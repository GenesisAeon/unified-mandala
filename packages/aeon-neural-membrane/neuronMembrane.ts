import { Network } from '../simple-neural-net';

/**
 * NeuronMembrane hält mehrere Spiegelungen eines Neural Networks.
 * Jede Ebene kann separat trainiert werden, Vorhersagen werden gemittelt.
 */
export class NeuronMembrane {
  private layers: Network[] = [new Network()];

  /** Anzahl der vorhandenen Fraktalebenen */
  get depth(): number {
    return this.layers.length;
  }

  /**
   * Erzeugt eine weitere Spiegelung des Netzes.
   */
  reflect(times = 1) {
    for (let i = 0; i < times; i++) {
      this.layers.push(new Network());
    }
  }

  /**
   * Mittelt die Vorhersagen aller Ebenen.
   */
  predict(i1: number, i2: number): number {
    const sum = this.layers.reduce((acc, n) => acc + n.predict(i1, i2), 0);
    return sum / this.layers.length;
  }

  /**
   * Gibt Zugriff auf die internen Netze (nur f\u00fcr Diagnosezwecke).
   */
  getNetworks(): Network[] {
    return this.layers;
  }
}

export class NullMembrane {
  step(t: number, v: number) {
    return { t, value: v, severity: 'ok', state: 'subcritical', dA: 0, A: 0 } as import('./index').Reading;
  }
}

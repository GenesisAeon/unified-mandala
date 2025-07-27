export class PyramidAudio {
  private ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

  playTone(freq: number) {
    const osc = this.ctx.createOscillator();
    osc.frequency.value = freq;
    osc.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }
}

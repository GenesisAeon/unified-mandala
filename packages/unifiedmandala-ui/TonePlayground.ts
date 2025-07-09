export interface TonePlayground {
  playTone: (frequency: number) => string;
  stop: () => void;
}

export function createTonePlayground(): TonePlayground {
  let current = 0;
  return {
    playTone(freq: number) {
      current = freq;
      return `playing ${freq}`;
    },
    stop() {
      current = 0;
    }
  };
}

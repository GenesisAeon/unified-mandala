const audioContextCache: Record<string, AudioContext | undefined> = {};

export function getAudioContext(key = 'default'): AudioContext {
  if (!audioContextCache[key]) {
    if (
      typeof window !== 'undefined' &&
      (window.AudioContext || (window as any).webkitAudioContext)
    ) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextCache[key] = new Ctx();
    } else {
      audioContextCache[key] = {} as any;
    }
  }
  return audioContextCache[key] as AudioContext;
}

const layerCache: Map<string, any> = new Map();
export function cacheLayer(key: string, layer: any) {
  layerCache.set(key, layer);
}
export function getCachedLayer<T>(key: string): T | undefined {
  return layerCache.get(key) as T | undefined;
}

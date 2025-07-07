export interface CMBMap {
  temperature: number[];
}

export interface NeutrinoFlux {
  energy: number[];
}

export async function loadCMBMap(): Promise<CMBMap> {
  return { temperature: [2.7] };
}

export async function loadNeutrinoFlux(): Promise<NeutrinoFlux> {
  return { energy: [1] };
}

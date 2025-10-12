export type EmergenceClass = 'low' | 'medium' | 'high';
export const classifyEmergence = (p: number): EmergenceClass =>
  p >= 0.66 ? 'high' : p >= 0.33 ? 'medium' : 'low';
export const emergenceClass = classifyEmergence;

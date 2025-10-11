import { Adapter, ok } from '../base';

export interface OisstSample {
  region: string;
  sst: number[];
  unit: '°C';
}

export const oisstRaw: Adapter<OisstSample> = async () => {
  return ok({ region: 'pacific', sst: [23.1, 23.4, 23.0, 22.9], unit: '°C' });
};

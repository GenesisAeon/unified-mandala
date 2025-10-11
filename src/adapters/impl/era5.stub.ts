import { Adapter, ok } from '../base';

// Demo-Datentyp
export interface Era5Sample {
  location: string;
  values: number[];
  unit: 'K' | '°C';
}

// "Roh"-Adapter (kann später echte Fetch-Logik bekommen)
export const era5Raw: Adapter<Era5Sample> = async () => {
  // Dummy: deterministische Daten
  return ok({ location: 'global', values: [289.2, 289.0, 288.9, 289.3], unit: 'K' });
};

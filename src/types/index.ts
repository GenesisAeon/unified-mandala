export type AdapterIndexEntry = {
  id: string;
  source: string;
  crepScore?: number;
};

export type UMIndex = {
  adapters: AdapterIndexEntry[];
  sigillins: any[];
};

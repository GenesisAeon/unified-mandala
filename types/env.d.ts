/// <reference types="vite/client" />

// Vite & Node Env Typen
interface ImportMetaEnv {
  readonly UI_DIST?: string;
  readonly OFFLINE?: string;
  readonly LOW_MEM?: string;
  readonly VITE_LOW_MEM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface ProcessEnv {
    UI_DIST?: string;
    OFFLINE?: string;
    LOW_MEM?: string;
    ENABLE_UNIVERSE_SIM?: string;
    ENABLE_QUANTUM?: string;
  }
}

declare module '*.yaml' {
  const v: any;
  export default v;
}

declare module '*.yml' {
  const v: any;
  export default v;
}

declare module '*.md' {
  const v: string;
  export default v;
}

// Für JSON mit/ohne Import Assertions
declare module '*.json' {
  const v: any;
  export default v;
}

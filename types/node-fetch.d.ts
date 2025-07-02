declare module 'node-fetch' {
  interface Response {
    ok: boolean;
    status: number;
    text(): Promise<string>;
  }
  function fetch(url: string, init?: Record<string, any>): Promise<Response>;
  export default fetch;
}

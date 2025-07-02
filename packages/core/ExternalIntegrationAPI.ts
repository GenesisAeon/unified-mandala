export async function callExternal(endpoint: string): Promise<string> {
  return Promise.resolve(`called ${endpoint}`);
}

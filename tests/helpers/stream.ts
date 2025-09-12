export async function loadStreamArray() {
  const mod = await import("stream-json/streamers/StreamArray");
  return mod.StreamArray;
}

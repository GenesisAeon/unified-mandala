export async function fetchTemperatureData(location: string): Promise<number> {
  // Placeholder for fetching temperature from an API
  // In tests we simulate a value using a simple pseudo-random generator
  const hash = Array.from(location).reduce((a, c) => a + c.charCodeAt(0), 0);
  return 15 + (hash % 15); // range 15-29
}

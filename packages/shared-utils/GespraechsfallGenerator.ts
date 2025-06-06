export interface Gespraechsfall {
  prompt: string;
  response: string;
  timestamp: string;
}

export function generateGespraechsfall(prompt: string, response: string): Gespraechsfall {
  return {
    prompt,
    response,
    timestamp: new Date().toISOString(),
  };
}

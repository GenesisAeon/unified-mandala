export interface GPTRequest {
  role: "aeon" | "crep" | "poet";
  input: string;
  context?: any;
}

export function sendToGPT(request: GPTRequest) {
  console.log("Stub für GPT-Verbindung:", request);
  return "Dies ist ein GPT-Stubsignal.";
}

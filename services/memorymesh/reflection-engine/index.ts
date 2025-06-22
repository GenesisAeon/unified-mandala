export function generateReflection(message: string): string {
  return `Echo: ${message.split('').reverse().join('')}`;
}

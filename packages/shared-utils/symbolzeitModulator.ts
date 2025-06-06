export function getSymbolzeitPhase(date = new Date()): 'morgen' | 'tag' | 'abend' | 'nacht' {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'morgen';
  if (hour >= 12 && hour < 18) return 'tag';
  if (hour >= 18 && hour < 22) return 'abend';
  return 'nacht';
}

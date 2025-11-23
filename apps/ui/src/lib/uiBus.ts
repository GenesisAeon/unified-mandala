export const openRUMSettings = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-settings:rum'));
  }
};

export function announceGrafanaValidity(valid: boolean) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('grafana-validity', { detail: { valid } }));
  }
}

export function onGrafanaValidity(handler: (valid: boolean) => void) {
  const listener = (e: Event) => {
    const any = e as any;
    handler(Boolean(any?.detail?.valid));
  };
  window.addEventListener('grafana-validity', listener as any);
  return () => window.removeEventListener('grafana-validity', listener as any);
}

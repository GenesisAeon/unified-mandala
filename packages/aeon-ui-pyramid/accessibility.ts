export function ariaLabel(el: HTMLElement, label: string) {
  el.setAttribute('aria-label', label);
}

export function applyColorBlindMode(el: HTMLElement) {
  el.classList.add('color-blind');
}

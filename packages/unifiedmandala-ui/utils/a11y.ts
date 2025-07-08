export function applyAria(el: HTMLElement, role: string, label: string) {
  el.setAttribute('role', role);
  el.setAttribute('aria-label', label);
}

export function enableColorblindMode(doc: Document = document) {
  doc.body.classList.add('colorblind-mode');
}

export function disableColorblindMode(doc: Document = document) {
  doc.body.classList.remove('colorblind-mode');
}

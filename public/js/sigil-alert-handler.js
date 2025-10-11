export function registerSigilHandler(socket) {
  socket.on('sigil_alert', (sigil) => {
    const el = document.createElement('div');
    el.className = `sigil ${sigil.effect}`;
    el.textContent = sigil.id;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  });
}

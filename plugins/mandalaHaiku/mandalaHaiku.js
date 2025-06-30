module.exports = {
  initialize({ io, logger }) {
    logger && logger('mandalaHaiku initialized');
    io.on('connection', (socket) => {
      socket.on('sigil_alert', (alert) => {
        if (alert.id === 'aeon:2025-0626-HIGH-ENERGY') {
          const haiku = generateHaiku(alert.crep);
          socket.emit('haiku_response', { haiku });
          logger && logger(`Emitted haiku: ${haiku}`);
        }
      });
    });
    function generateHaiku() {
      const templates = [
        'Leuchtendes Sigil – / Träger von Klang und Tiefen / Mandala erwacht',
        'Im Resonanzfeld / tanzt das Echo stiller Kraft / Haiku verweht nie',
        'Dreifach-Welle ruft / Poetik in Codes geschrieben / Herz findet Klang'
      ];
      const idx = Math.floor(Math.random() * templates.length);
      return templates[idx];
    }
  }
};

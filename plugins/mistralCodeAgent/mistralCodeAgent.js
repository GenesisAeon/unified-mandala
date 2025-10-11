module.exports = {
  initialize({ io, logger }) {
    logger && logger('[MistralCodeAgent] initialized');
    io.on('connection', (socket) => {
      socket.on('mistral_snippet', async (snippet) => {
        try {
          const res = await fetch('http://localhost:4111/code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ snippet }),
          });
          const data = await res.json();
          socket.emit('mistral_result', data);
        } catch (err) {
          socket.emit('mistral_result', { error: 'request failed' });
        }
      });
    });
  },
};

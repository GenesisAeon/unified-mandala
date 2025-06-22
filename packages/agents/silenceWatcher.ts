import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

export function silenceWatcher(thresholdMs = 15000) {
  let last = Date.now();
  GPTEventHub.on("*", () => { last = Date.now(); });
  setInterval(() => {
    if (Date.now() - last > thresholdMs) {
      GPTEventHub.emit('orakel:says', { text: '… Stille spricht lauter als Worte.' });
    }
  }, thresholdMs / 2);
}

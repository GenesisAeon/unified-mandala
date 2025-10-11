import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

export class AeonOrakelTTS {
  private synthesis: SpeechSynthesis | null =
    typeof window !== 'undefined' ? window.speechSynthesis : null;

  constructor() {
    GPTEventHub.on('orakel:says', this.onOrakelMessage.bind(this));
  }

  private onOrakelMessage(msg: { content: string }): void {
    if (!this.synthesis) return;
    const utter = new SpeechSynthesisUtterance(msg.content);
    utter.lang = 'de-DE';
    utter.rate = 1.0;
    utter.pitch = 1.2;
    this.synthesis.speak(utter);
  }
}

// gleich initialisieren
new AeonOrakelTTS();

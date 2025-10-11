# GPT Bridges

Stub-Module zur Kommunikation mit GPT-Diensten.

- **GPTEventHub** – Einfacher EventEmitter auf Basis von mitt
- **aeon-gpt-synapse.ts** – Sende/Empfange Anfragen an GPT. Die Funktion
  `sendToGPT` wiederholt fehlgeschlagene Netzaufrufe bis zu drei Mal und gibt
  bei endgültigem Fehlschlag eine aussagekräftige Fehlermeldung zurück.
- **AEONPOET** und **CREPJUDGE** – Platzhalter für spezialisierte GPT-Rollen
- **GPTConversationLogger** – zeichnet Prompts und Antworten über den EventHub auf

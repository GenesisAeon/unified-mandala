# TTS

Simple speech synthesis that reacts to messages from the GPT event hub.

## Key module
- `AeonOrakelTTS.ts` – listens for `orakel:says` events and speaks them.

## Basic usage
```ts
import '@unified-mandala/tts'; // side-effect initialization
```

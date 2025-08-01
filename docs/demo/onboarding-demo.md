# Onboarding Demo

Dieses kurze Tutorial zeigt, wie du eine lokale Entwicklungsumgebung für UnifiedMandala startest und den Mistral Code Agent ausprobierst.

1. **Repository klonen und Setup ausführen**
   ```bash
   git clone https://github.com/GenesisAeon/unified-mandala.git
   cd unified-mandala
   ./scripts/setup-unifiedmandala.sh
   pnpm install
   ```
2. **API und UI starten**
   ```bash
   pnpm dev
   ```
3. **Mistral Code Agent verwenden**
   ```bash
   pnpm run mistral:generate -- --prompt "hello world"
   ```
   Das Kommando ruft den Mistral Agenten auf und gibt den generierten Code in der Konsole aus.

Weitere Details findest du im [Community Onboarding Guide](../CommunityOnboarding.md).

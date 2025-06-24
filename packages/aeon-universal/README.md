# Aeon Universal

Eine fraktale, kontextsensitive Programmiersprache innerhalb des UnifiedMandala. Sie kompiliert einfache Befehle in Mandala-Tasks und speichert Kontext direkt im `AeonMemory`.  
Seit `v0.2` unterstützt sie auch **SIG**-Anweisungen, um poetische Zustände im `AeonSigillinVault` festzuhalten.

Ab Version **0.3** lassen sich weitere Dateien rekursiv einbinden. Die `INCLUDE`-Anweisung liest andere Aeon-Quellen und erweitert so den Task-Baum.

## Beispiel
```aeon
TASK Hallo Welt
REM Sammle Kontext
SIG Poetischer Zustand
INCLUDE ./mehr.aeon
```

# Aeon Universal

Eine fraktale, kontextsensitive Programmiersprache innerhalb des UnifiedMandala. Sie kompiliert einfache Befehle in Mandala-Tasks und speichert Kontext direkt im `AeonMemory`.  
Seit `v0.2` unterstützt sie auch **SIG**-Anweisungen, um poetische Zustände im `AeonSigillinVault` festzuhalten.

Ab Version **0.3** lassen sich weitere Dateien rekursiv einbinden. Die `INCLUDE`-Anweisung liest andere Aeon-Quellen und erweitert so den Task-Baum.

Seit **0.4** verfügt Aeon Universal über ein einfaches Makrosystem. Mit `DEFINE <name>`
können Task-Blöcke deklariert und später via `CALL <name>` wiederverwendet. Das
erlaubt rekursive, fraktale Programmstrukturen ohne externe Abhängigkeiten.

Ab **0.5** kann ein **WITH**-Block genutzt werden, um Kontext hierarchisch
anzugeben. Alle darin enthaltenen `TASK`s erhalten einen zusammengesetzten
`context`-Pfad, der später zur Auswertung dient. Ein `ENDWITH` beendet den
aktuellen Kontext.

## Beispiel
```aeon
TASK Hallo Welt
REM Sammle Kontext
SIG Poetischer Zustand
INCLUDE ./mehr.aeon
DEFINE begrüßung
  TASK Hallo
END
CALL begrüßung
WITH ProjektX
  TASK Schritt1
ENDWITH
```

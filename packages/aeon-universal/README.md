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

Seit **0.6** existiert der Befehl **GUARD**. Er protokolliert Schutz-
oder Sicherheitsnotizen im `AeonSigillinVault` und dient der
dialogischen Selbstabsicherung des Systems.

Ab **0.7** steht ein **REPEAT**-Block zur Verfügung, um Aufgaben mehrmals auszuführen. Zudem kann das
Kompilat über `transpileToTS()` in TypeScript, `transpileToPython()` in Python, `transpileToGo()` in Go oder `transpileToRust()` in Rust exportiert werden.

Ab **0.8** akzeptieren Makros optionale Parameter. Definiert mit `DEFINE name param`, können Platzhalter
`$param` innerhalb des Blocks verwendet und bei `CALL name value` ersetzt werden.

Ab **0.9** kann Aeon Universal direkt nach JavaScript transpiliert werden. Die Funktion
`transpileToJS()` erzeugt ein simples ES-Modul mit `aeonTasks`-Array.

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
GUARD Nur intern verwenden
REPEAT 2
  TASK Wiederholt
ENDREPEAT
ENDWITH
```

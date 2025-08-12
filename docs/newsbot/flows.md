# NewsBot Flows

Diese Datei beschreibt die drei zentralen Flusslinien des NewsBot-Systems. Sie dienen als Orientierung für Entwickler:innen und Agenten bei der weiteren Umsetzung.

## 1. Live Cycle Flow

1. **NewsFetch** – sammelt aktuelle Nachrichtenquellen.
2. **ScriptGen** – wandelt Rohdaten in gesprochene Skripte um.
3. **TTS** – erzeugt Audiosequenzen aus den Skripten.
4. **Avatar** – rendert einen Avatar mit Audio und Mimik.
5. **Stream** – sendet den fertigen Beitrag an den Broadcast-Kanal.

Dieser Pfad bildet den Kernlauf, über den jede Ausgabe des NewsBot entsteht.

## 2. Training Flow

1. Klienten oder interne Ereignisse rufen `/training/collect` auf.
2. Der Orchestrator speichert die Payload im `TrainingStore`.
3. `/finetune` startet LoRA-Finetuning auf den gesammelten Samples.
4. Das aktualisierte Modell wird registriert und steht dem NewsBot zur Verfügung.

Damit ist ein kontinuierlicher Lernzyklus gesichert, der neue Daten integriert.

## 3. Draft & Publish Flow

1. **ScriptGen** erzeugt einen Entwurf und legt ihn im `DraftStore` ab.
2. **ReviewAgent** prüft den Entwurf und empfiehlt Freigabe oder Ablehnung.
3. Ein manueller Gatekeeper bestätigt die Entscheidung.
4. `/publish` verschiebt genehmigte Entwürfe in den `LiveStore` und triggert den Stream.

Dieser Flow gewährleistet redaktionelle Kontrolle und Nachvollziehbarkeit.

# Aeon GenesisOS

Basissystem der CREP-Engine mit Symbolzeit und dynamischer Zustandslogik.

## Manager vs. Orchestrator

Im Kontext von **Aeon GenesisOS** sind _Manager_ f\xFCr die Kapselung einzelner Zust\xE4nde oder Datenquellen zust\xE4ndig. Ein Manager besitzt eine klar definierte Aufgabe (z.B. CREP-Werte verwalten) und stellt daf\xFCr Methoden bereit.

Ein _Orchestrator_ hingegen koordiniert mehrere Manager oder Services und verbindet deren Abl\xE4ufe zu einem gr\xF6\xDFeren Prozess. Orchestratoren k\xF6nnen Aufgaben delegieren und Ergebnisse zusammenf\xFChren.

Kurz gesagt: **Manager** \u2013 Verwaltung eines bestimmten Bereichs, **Orchestrator** \u2013 Ablaufsteuerung \u00FCber verschiedene Manager hinweg.

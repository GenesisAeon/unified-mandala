#!/bin/bash
# Führt die QA-Suite aus und speichert eine Zusammenfassung.

pnpm qa > docs/unifiedmandala_test_report.md
RESULT=$?
if [ $RESULT -ne 0 ]; then
  echo "QA-Lauf fehlgeschlagen" >> docs/unifiedmandala_test_report.md
else
  echo "QA erfolgreich" >> docs/unifiedmandala_test_report.md
fi
exit $RESULT

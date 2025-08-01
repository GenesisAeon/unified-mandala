#!/bin/bash
# Executes the full test suite and appends a short summary.
pnpm test > docs/unifiedmandala_test_report.md
RESULT=$?
if [ $RESULT -ne 0 ]; then
  echo "Tests failed" >> docs/unifiedmandala_test_report.md
else
  echo "Tests passed" >> docs/unifiedmandala_test_report.md
fi

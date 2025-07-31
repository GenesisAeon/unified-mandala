#!/bin/bash
if [ -f docs/unifiedmandala_test_report.md ]; then
  echo "report exists"
else
  echo "no report" && exit 1
fi

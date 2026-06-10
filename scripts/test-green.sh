#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "== TDD GREEN =="
if [ -n "${FOCUSED_TEST_CMD:-}" ]; then
  echo "+ ${FOCUSED_TEST_CMD}"
  bash -lc "${FOCUSED_TEST_CMD}"
else
  echo "FOCUSED_TEST_CMD is not set; running scripts/check.sh instead."
  scripts/check.sh
fi

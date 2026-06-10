#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [ -z "${FOCUSED_TEST_CMD:-}" ]; then
  echo "Set FOCUSED_TEST_CMD to the focused test that should fail first."
  exit 2
fi

echo "== TDD RED =="
echo "+ ${FOCUSED_TEST_CMD}"
set +e
bash -lc "${FOCUSED_TEST_CMD}"
status=$?
set -e

if [ "$status" -eq 0 ]; then
  echo "Expected the focused test to fail, but it passed."
  exit 1
fi

echo "RED confirmed: focused test failed as expected."

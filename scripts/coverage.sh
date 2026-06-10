#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "== coverage checks =="

echo "No coverage command was detected. Add coverage commands to scripts/coverage.sh when available."
exit 0

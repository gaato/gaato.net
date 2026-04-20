#!/usr/bin/env bash
set -euo pipefail

moon update

if ! moon build --release; then
  :
fi

bun run patch:luna

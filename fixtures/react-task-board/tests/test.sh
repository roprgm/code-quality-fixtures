#!/bin/bash
set -euo pipefail

find /app/src -type f \( -name '*.ts' -o -name '*.tsx' \) -print0 \
  | sort -z \
  | while IFS= read -r -d '' file; do
      printf '\n--- %s ---\n' "$file"
      cat "$file"
    done > /logs/verifier/source.txt

cp -R /tests/.fixture/src/. /app/src/
uvx --from harbor-rewardkit==0.1.7 rewardkit /tests

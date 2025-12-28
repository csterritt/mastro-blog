#!/bin/bash
set -euo pipefail

concurrently -c auto \
  -n tailwind,mastro \
  "bunx @tailwindcss/cli -i ./routes/in-styles.css -o ./routes/styles.css --watch" \
  "bun --watch server.ts"

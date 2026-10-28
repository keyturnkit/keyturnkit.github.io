#!/bin/sh
# Builds assets/tools/csv.js (WordPress/Squarespace XML to Framer CSV) from the Blog Import plugin's wxr parser.
# BLOG_IMPORT is the plugin project (default: the team's checkout); its node_modules is on NODE_PATH.
# For testing only: OUT=<file> writes somewhere else.
set -e
cd "$(dirname "$0")/.."
SRC="${BLOG_IMPORT:-$HOME/sandbox/99_sideline/team3-chichi/products/wp-import}"
OUT="${OUT:-assets/tools/csv.js}"
NODE_PATH="$SRC/node_modules" npx --yes esbuild@0.25.5 tools-src/csv-entry.ts --bundle --minify --format=esm --target=es2020 \
  --alias:@parsers="$SRC/src/core" --legal-comments=none --outfile="$OUT.tmp"
{ echo '// Built from the Blog Import parser (wxr.ts) plus tools-src/csv*.ts. Run tools-src/build-csv.sh to rebuild.'
  echo '// Reads the chosen file in the browser only. Nothing is uploaded.'
  cat "$OUT.tmp"; } > "$OUT"
rm "$OUT.tmp"
wc -c "$OUT"

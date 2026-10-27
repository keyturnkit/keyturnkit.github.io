#!/bin/sh
# Builds assets/tools/inspector.js from the Blog Import plugin's parsers.
# BLOG_IMPORT is the plugin project (default: the team's checkout); its node_modules supplies fflate.
set -e
cd "$(dirname "$0")/.."
SRC="${BLOG_IMPORT:-$HOME/sandbox/99_sideline/team3-chichi/products/wp-import}"
OUT=assets/tools/inspector.js
NODE_PATH="$SRC/node_modules" npx --yes esbuild@0.25.5 tools-src/entry.ts --bundle --minify --format=esm --target=es2020 \
  --alias:@parsers="$SRC/src/core" --legal-comments=none --outfile="$OUT.tmp"
{ echo '// Built from the Blog Import parsers (wxr.ts, blogger.ts, medium.ts, ghost.ts, substack.ts) plus tools-src/. Run tools-src/build.sh to rebuild.'
  echo '// Reads the chosen file in the browser only. Nothing is uploaded.'
  cat "$OUT.tmp"; } > "$OUT"
rm "$OUT.tmp"
wc -c "$OUT"

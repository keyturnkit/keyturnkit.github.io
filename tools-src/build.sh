#!/bin/sh
# Builds assets/tools/inspector.js from the Blog Import plugin's parsers.
# BLOG_IMPORT is the plugin project (default: the team's checkout); its node_modules supplies fflate.
# For testing only: OUT=<file> writes somewhere else, and FORCE_ON=1 builds with every BLOG_IMPORT_READS_* constant true
# (from a temporary copy of tools-src, so the source keeps its values).
set -e
cd "$(dirname "$0")/.."
SRC="${BLOG_IMPORT:-$HOME/sandbox/99_sideline/team3-chichi/products/wp-import}"
OUT="${OUT:-assets/tools/inspector.js}"
ENTRY=tools-src/entry.ts
if [ -n "$FORCE_ON" ]; then
  TMP="$(mktemp -d)"
  cp tools-src/*.ts "$TMP/"
  sed -i.bak 's/^\(export const BLOG_IMPORT_READS_[A-Z]* = \)false;/\1true;/' "$TMP/render.ts"
  ENTRY="$TMP/entry.ts"
fi
NODE_PATH="$SRC/node_modules" npx --yes esbuild@0.25.5 "$ENTRY" --bundle --minify --format=esm --target=es2020 \
  --alias:@parsers="$SRC/src/core" --legal-comments=none --outfile="$OUT.tmp"
{ echo '// Built from the Blog Import parsers (wxr.ts, blogger.ts, medium.ts, ghost.ts, substack.ts, hashnode.ts, webflow.ts) plus tools-src/. Run tools-src/build.sh to rebuild.'
  echo '// Reads the chosen file in the browser only. Nothing is uploaded.'
  cat "$OUT.tmp"; } > "$OUT"
rm "$OUT.tmp"
[ -z "$FORCE_ON" ] || rm -rf "$TMP"
wc -c "$OUT"

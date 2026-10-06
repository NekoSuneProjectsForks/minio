#!/usr/bin/env bash
set -euo pipefail

CONSOLE_DIR="${1:-console-src}"
THEME_FILE="${2:-custom-ui/theme-overrides.css}"

if [[ ! -d "$CONSOLE_DIR/web-app" ]]; then
  echo "Console source not found: $CONSOLE_DIR/web-app" >&2
  exit 1
fi

if [[ ! -f "$THEME_FILE" ]]; then
  echo "Theme file not found: $THEME_FILE" >&2
  exit 1
fi

ROOT_STYLES="$CONSOLE_DIR/web-app/public/styles/root-styles.css"
INDEX_HTML="$CONSOLE_DIR/web-app/public/index.html"

cat "$THEME_FILE" >> "$ROOT_STYLES"

# Brand browser metadata without removing MinIO copyright/license notices.
python3 - "$INDEX_HTML" <<'PY'
from pathlib import Path
import sys

p = Path(sys.argv[1])
s = p.read_text()
s = s.replace("<title>MinIO Console</title>", "<title>NekoSune MinIO Console</title>")
s = s.replace('content="#081C42"', 'content="#050a07"')
s = s.replace('content="MinIO Console"', 'content="NekoSune MinIO Console"')
p.write_text(s)
PY

echo "Applied NekoSune green/black Console theme."

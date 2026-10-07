#!/usr/bin/env bash
# SwapMeet — single entry point.
#
#   ./start.sh            dev: API on :3001 + Vite on :5173 (hot reload)
#   ./start.sh prod       build the client, then Fastify serves API + UI on :3001
#
# Overrides:  SERVER_PORT=3002 CLIENT_PORT=5174 ./start.sh
#
# Preflight: node >= 20, deps installed, ports free, fd limit raised (macOS
# defaults to 256 and Vite's watcher hits EMFILE). Then waits for both ends to
# answer over HTTP before declaring READY — no assumptions, only evidence.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

MODE="${1:-dev}"
export SERVER_PORT="${SERVER_PORT:-3001}"
export CLIENT_PORT="${CLIENT_PORT:-5173}"
export PORT="$SERVER_PORT"   # server/server.js reads PORT

log()  { printf '\033[36m[start]\033[0m %s\n' "$*"; }
warn() { printf '\033[33m[start]\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[31m[start]\033[0m %s\n' "$*" >&2; exit 1; }

case "$MODE" in
  dev|prod) ;;
  -h|--help|help) sed -n '2,11p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
  *) die "unknown mode '$MODE' (expected: dev | prod)" ;;
esac

# --- toolchain -------------------------------------------------------------
command -v node >/dev/null || die "node not found — install Node 20+ (https://nodejs.org)"
command -v npm  >/dev/null || die "npm not found"
NODE_MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
(( NODE_MAJOR >= 20 )) || die "node $(node -v) is too old — Fastify 5 needs Node 20+"

# --- file descriptors (Vite watcher on macOS) -------------------------------
if (( "$(ulimit -n)" < 10240 )); then
  if ulimit -n 10240 2>/dev/null; then
    log "raised open-file limit to 10240"
  else
    warn "could not raise open-file limit (now $(ulimit -n)); Vite may hit EMFILE"
  fi
fi

# --- dependencies ----------------------------------------------------------
if [[ ! -x node_modules/.bin/concurrently || ! -x node_modules/.bin/vite ]]; then
  log "dependencies missing — running npm install"
  npm install
fi

# --- ports -----------------------------------------------------------------
port_owner() {  # prints "PID COMMAND" of the listener on $1, or nothing
  local pid
  pid="$(lsof -nP -iTCP:"$1" -sTCP:LISTEN -t 2>/dev/null | head -n1 || true)"
  [[ -n "$pid" ]] && ps -o pid=,command= -p "$pid" 2>/dev/null
}
require_free() {
  local owner
  owner="$(port_owner "$1" || true)"
  [[ -z "$owner" ]] || die "port $1 ($2) is already in use by: $owner
       stop it, or pick another port: SERVER_PORT=... CLIENT_PORT=... ./start.sh"
}
require_free "$SERVER_PORT" server
[[ "$MODE" == dev ]] && require_free "$CLIENT_PORT" client

# --- launch ----------------------------------------------------------------
CHILD=
cleanup() {
  trap - INT TERM EXIT
  if [[ -n "$CHILD" ]] && kill -0 "$CHILD" 2>/dev/null; then
    log "stopping (pid $CHILD)"
    kill -TERM "$CHILD" 2>/dev/null || true
    wait "$CHILD" 2>/dev/null || true
  fi
}
trap cleanup INT TERM EXIT

wait_for() {  # wait_for <label> <url> — polls up to 30s, fails if the child died
  local label="$1" url="$2" i
  for i in $(seq 1 60); do
    if curl -sf -o /dev/null "$url"; then log "$label is up: $url"; return 0; fi
    kill -0 "$CHILD" 2>/dev/null || die "$label process exited before it became healthy"
    sleep 0.5
  done
  die "$label did not answer at $url within 30s"
}

if [[ "$MODE" == dev ]]; then
  log "dev mode — server :$SERVER_PORT, client :$CLIENT_PORT"
  node_modules/.bin/concurrently -n server,client -c blue,green \
    "npm run dev -w server" \
    "npm run dev -w client -- --port $CLIENT_PORT --strictPort" &
  CHILD=$!
  wait_for server "http://localhost:$SERVER_PORT/api/health"
  wait_for client "http://localhost:$CLIENT_PORT/"
  log "READY → open http://localhost:$CLIENT_PORT  (API: http://localhost:$SERVER_PORT/api/listings)"
else
  log "prod mode — building client"
  npm run build
  npm run start -w server &
  CHILD=$!
  wait_for server "http://localhost:$SERVER_PORT/api/health"
  log "READY → open http://localhost:$SERVER_PORT  (API + built client)"
fi

log "Ctrl-C to stop both"
wait "$CHILD" || true

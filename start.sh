#!/bin/bash
# ─────────────────────────────────────────────────────────────
# WanderGenie — One-command startup (Mac / Linux)
# ─────────────────────────────────────────────────────────────
set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║        🌍  WanderGenie              ║${NC}"
echo -e "${CYAN}║     AI Travel Planner — Full Stack  ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
echo ""

# ── Backend ────────────────────────────────────────────────────
echo -e "${YELLOW}[1/4] Setting up Python backend...${NC}"
cd backend

if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "  Virtual environment created."
fi

source venv/bin/activate
pip install -r requirements.txt -q
echo -e "${GREEN}  ✓ Backend dependencies installed${NC}"

echo -e "${YELLOW}[2/4] Starting FastAPI backend on port 8000...${NC}"
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
echo -e "${GREEN}  ✓ Backend started (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready
sleep 2
cd ..

# ── Frontend ───────────────────────────────────────────────────
echo -e "${YELLOW}[3/4] Installing frontend dependencies...${NC}"
cd frontend
npm install --silent
echo -e "${GREEN}  ✓ Frontend dependencies installed${NC}"

echo -e "${YELLOW}[4/4] Starting Next.js frontend on port 3000...${NC}"
echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}  🌍 Frontend:  http://localhost:3000${NC}"
echo -e "${GREEN}  ⚡ Backend:   http://localhost:8000${NC}"
echo -e "${GREEN}  📖 API Docs:  http://localhost:8000/docs${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo "  Press Ctrl+C to stop all servers."
echo ""

# Kill backend if frontend exits
trap "kill $BACKEND_PID 2>/dev/null; echo 'All servers stopped.'" EXIT

npm run dev

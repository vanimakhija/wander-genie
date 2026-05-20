# 🌍 WanderGenie — Full-Stack AI Travel Planner

AI-powered trip planner with a **Next.js frontend** and **FastAPI backend**.  
Enter a destination + preferences → get a personalised itinerary + packing list.

---

## 📁 Project Structure

```
wander-genie-fullstack/
├── frontend/          ← Next.js 14 · React · TypeScript · Tailwind CSS
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          ← Home page (hero + form)
│   │   │   ├── results/page.tsx  ← Results page
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── TripForm.tsx
│   │   │   ├── LoadingScreen.tsx
│   │   │   ├── ItineraryCard.tsx
│   │   │   ├── PackingList.tsx
│   │   │   ├── WeatherCard.tsx
│   │   │   └── Footer.tsx
│   │   └── lib/
│   │       ├── api.ts            ← API calls + fallback mock
│   │       └── types.ts          ← Shared TypeScript types
│   └── .env.local                ← Frontend env (points to backend)
│
├── backend/           ← Python 3.11+ · FastAPI · OpenAI GPT-4o
│   ├── main.py        ← FastAPI app + routes
│   ├── ai_service.py  ← OpenAI GPT-4o integration
│   ├── mock_data.py   ← Rich fallback data (no API key needed)
│   ├── schemas.py     ← Pydantic request/response models
│   ├── requirements.txt
│   └── .env           ← Backend env (OpenAI key)
│
├── start.sh           ← One-command startup (Mac/Linux)
├── start.bat          ← One-command startup (Windows)
└── README.md
```

---

## 🚀 Quick Start (Recommended)


## WanderGenie AI Travel Planner
##Built with Next.js and FastAPI
### Prerequisites
- **Node.js 18+** — https://nodejs.org
- **Python 3.11+** — https://python.org

### Option A — One command (Mac / Linux)
```bash
chmod +x start.sh
./start.sh
```

### Option B — One command (Windows)
```
start.bat
```

Both scripts will install dependencies and start both servers automatically.

---

## 🔧 Manual Setup (Step by Step)

### Step 1 — Start the Backend

```bash
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate it:
#   Mac/Linux:
source venv/bin/activate
#   Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO  WanderGenie backend starting — mode: MOCK
INFO  Uvicorn running on http://127.0.0.1:8000
```

Open http://localhost:8000 to confirm it says `"status": "ok"`.

### Step 2 — Start the Frontend

Open a **new terminal** (keep the backend running).

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open http://localhost:3000 — the app is live!

---

## 🤖 Connecting Real AI (OpenAI GPT-4o)

By default the app uses **built-in mock data** — no API key needed, everything works immediately.

To use real AI-generated itineraries:

**1. Get an OpenAI API key:**
- Go to https://platform.openai.com/api-keys
- Create a new key

**2. Add it to the backend:**
```bash
# Edit backend/.env
OPENAI_API_KEY=sk-your-actual-key-here
USE_MOCK=false
```

**3. Restart the backend** — it will now call GPT-4o for every request.

> 💡 **Cost estimate:** Each trip generation uses ~1 000–2 000 tokens ≈ $0.01–0.02 with GPT-4o.

---

## 🌐 API Reference

### Health Check
```
GET http://localhost:8000/
```

### Generate Itinerary
```
POST http://localhost:8000/generate-itinerary
Content-Type: application/json

{
  "destination": "Goa",
  "budget": 20000,
  "duration": 5,
  "interests": ["beaches", "cafes", "nightlife"]
}
```

**Response:**
```json
{
  "destination": "Goa",
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival & First Impressions",
      "activities": ["...", "...", "..."],
      "meals": { "breakfast": "...", "lunch": "...", "dinner": "..." },
      "tips": "..."
    }
  ],
  "packing_list": [
    { "name": "Clothing", "items": ["..."] },
    { "name": "Essentials", "items": ["..."] }
  ],
  "weather": {
    "temperature": "32°C",
    "condition": "Sunny with coastal breeze",
    "rainPrediction": "15% chance of light rain",
    "suggestion": "...",
    "humidity": "78%",
    "icon": "sunny"
  }
}
```

You can also test it with the interactive API docs at: http://localhost:8000/docs

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env.local`)
| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | URL of the FastAPI backend |
| `NEXT_PUBLIC_USE_MOCK` | `false` | `true` = use frontend mock (no backend needed) |

### Backend (`backend/.env`)
| Variable | Default | Description |
|---|---|---|
| `GROQ_API_KEY` | *(empty)* | Your Groq API key (free Llama 3) |
| `OPENWEATHER_API_KEY` | *(empty)* | OpenWeatherMap key for **live** weather on results |
| `USE_MOCK` | `false` | `true` = always use mock data |

---

## 🔥 Troubleshooting

| Problem | Fix |
|---|---|
| `npm install` fails | Make sure Node.js 18+ is installed |
| `pip install` fails | Make sure Python 3.11+ is installed and venv is activated |
| Frontend shows "Backend unreachable" | Make sure `uvicorn` is running on port 8000 |
| Empty results or errors | Check backend terminal for error logs |
| Port 3000 already in use | Run `npm run dev -- --port 3001` and update `.env.local` |

---

## 🚢 Deployment

- **Frontend** → Deploy to [Vercel](https://vercel.com) (free tier works)
- **Backend** → Deploy to [Render](https://render.com) or [Railway](https://railway.app) (free tier works)

After deploying the backend, update `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

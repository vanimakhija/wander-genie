# WanderGenie — AI Travel Planner

> Plan your perfect trip in seconds. Enter a destination and preferences, get a personalised day-by-day itinerary, weather-aware packing list, and shareable trip link — powered by LLaMA 3.

**Live Demo → [wander-genie-indol.vercel.app](https://wander-genie-indol.vercel.app)**

![WanderGenie Screenshot](./docs/screenshot.png)

---

## What it does

- Generates a detailed day-by-day itinerary with real place names, restaurants, and insider tips
- Builds a smart packing list based on destination, travel month, and your interests (e.g. Goa in June = monsoon gear, not beach gear)
- Shows real weather conditions for your destination in that specific month
- Creates a shareable link for every trip so you can send it to friends

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend | Python 3.11, FastAPI, Uvicorn |
| AI | Groq API — LLaMA 3.3 70B (free tier) |
| Weather | OpenWeatherMap API |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
wander-genie/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           ← Home page with trip form
│   │   │   └── results/page.tsx   ← Itinerary results page
│   │   ├── components/
│   │   │   ├── TripForm.tsx       ← Main input form
│   │   │   ├── ItineraryCard.tsx  ← Day-by-day itinerary display
│   │   │   ├── PackingList.tsx    ← Smart packing list
│   │   │   └── WeatherCard.tsx    ← Weather summary
│   │   └── lib/
│   │       ├── api.ts             ← API calls to backend
│   │       └── types.ts           ← TypeScript types
│   └── .env.local
│
├── backend/
│   ├── main.py          ← FastAPI routes
│   ├── ai_service.py    ← Groq LLaMA 3 integration
│   ├── schemas.py       ← Pydantic models
│   ├── mock_data.py     ← Fallback data (works without API key)
│   └── requirements.txt
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- Python 3.11+

### Backend

```bash
cd backend
python -m venv venv

# Mac/Linux
source venv/bin/activate
# Windows
venv\Scripts\activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Visit http://localhost:8000 — you should see `"status": "ok"`.

### Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000 — the app is live.

---

## Environment Variables

### Frontend — `frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend — `backend/.env`
```
GROQ_API_KEY=your_groq_key_here
OPENWEATHER_API_KEY=your_openweather_key_here
USE_MOCK=false
```

**Get free API keys:**
- Groq (LLaMA 3, completely free) → https://console.groq.com
- OpenWeatherMap (free tier) → https://openweathermap.org/api

Without API keys, the app uses built-in mock data and still works fine.

---

## API Reference

### Health check
```
GET /
```

### Generate itinerary
```
POST /generate-itinerary
Content-Type: application/json

{
  "destination": "Goa",
  "budget": 20000,
  "duration": 5,
  "travel_month": "June",
  "interests": ["beaches", "cafes", "nightlife"]
}
```

Interactive API docs available at http://localhost:8000/docs

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | wander-genie-indol.vercel.app |
| Backend | Render | wandergenie-backend-9xta.onrender.com |

To deploy your own instance, set `NEXT_PUBLIC_API_URL` in Vercel environment variables to your Render backend URL.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Backend unreachable | Make sure uvicorn is running on port 8000 |
| Empty results | Check backend logs for API key errors |
| Port 3000 in use | Run `npm run dev -- --port 3001` |
| Slow first response on Render | Free tier sleeps after inactivity — first request takes ~30s |

---

## Author

**Vani Makhija** — Final Year Student  
[GitHub](https://github.com/vanimakhija) · [Live Demo](https://wander-genie-indol.vercel.app)
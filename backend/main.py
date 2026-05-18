# backend/main.py
"""
WanderGenie — FastAPI Backend (Groq / Llama 3)
------------------------------------------------
Start with:
    uvicorn main:app --reload --port 8000

Endpoints:
    GET  /                    health check
    POST /generate-itinerary  main endpoint
    GET  /docs                interactive API docs
"""

import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from ai_service import generate_with_ai
from schemas import TripRequest, TripResponse

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger("wandergenie")


@asynccontextmanager
async def lifespan(app: FastAPI):
    api_key = os.getenv("GROQ_API_KEY", "")
    use_mock = os.getenv("USE_MOCK", "false").lower() == "true"
    is_mock = use_mock or not api_key or api_key.startswith("gsk_your")
    mode = "MOCK (no real AI)" if is_mock else "Groq Llama 3 (FREE AI)"
    logger.info("WanderGenie backend starting — mode: %s", mode)
    yield
    logger.info("WanderGenie backend stopped")


app = FastAPI(
    title="WanderGenie API",
    description="AI-powered travel itinerary generator using Groq (free Llama 3)",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow the Next.js dev server to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        # Add your Vercel URL here when deploying:
        # "https://your-app.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again."},
    )


@app.get("/", tags=["Health"])
async def health_check():
    """Health check — open this in your browser to confirm the server is running."""
    api_key = os.getenv("GROQ_API_KEY", "")
    use_mock = os.getenv("USE_MOCK", "false").lower() == "true"
    is_mock = use_mock or not api_key or api_key.startswith("gsk_your")
    return {
        "status": "ok",
        "service": "WanderGenie API",
        "version": "1.0.0",
        "mode": "mock" if is_mock else "groq-llama3",
        "message": "Backend is running! Open http://localhost:3000 for the app.",
    }


@app.post(
    "/generate-itinerary",
    response_model=TripResponse,
    summary="Generate AI travel itinerary + packing list",
    tags=["Trip"],
)
async def generate_itinerary(req: TripRequest):
    """
    Accepts trip preferences and returns a personalised itinerary + packing list.

    Example request:
    {
      "destination": "Goa",
      "budget": 20000,
      "duration": 5,
      "interests": ["beaches", "cafes", "nightlife"]
    }
    """
    logger.info(
        "Trip request — destination: %s | days: %d | budget: %.0f | interests: %s",
        req.destination, req.duration, req.budget, req.interests,
    )

    try:
        result = await generate_with_ai(req)
        logger.info("Trip generated successfully for: %s", req.destination)
        return result
    except Exception as exc:
        logger.error("Failed to generate trip: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to generate itinerary. Please try again."
        )

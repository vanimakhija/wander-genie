# backend/weather_service.py
"""Live weather via OpenWeatherMap (current + short-term rain forecast)."""

import logging
import os
from typing import Optional

import httpx

from schemas import TripResponse, WeatherInfo

logger = logging.getLogger(__name__)

BASE = "https://api.openweathermap.org/data/2.5"
TIMEOUT = 10.0


def _api_key() -> str:
    return os.getenv("OPENWEATHER_API_KEY", "").strip()


def _map_icon(main: str, temp_c: float) -> str:
    main_lower = (main or "").lower()
    if main_lower in ("rain", "drizzle", "thunderstorm", "snow"):
        return "rainy"
    if temp_c >= 34:
        return "hot"
    if main_lower == "clear":
        return "sunny"
    return "cloudy"


def _suggestion(condition: str, temp_c: float, rain_pct: int, humidity: int) -> str:
    parts: list[str] = []
    if rain_pct >= 50:
        parts.append("Rain is likely — pack a waterproof jacket and umbrella.")
    elif rain_pct >= 25:
        parts.append("Light rain possible — keep a compact umbrella handy.")
    if temp_c >= 32:
        parts.append("It is hot — stay hydrated and use SPF 50 sunscreen.")
    elif temp_c <= 12:
        parts.append("Cool temperatures — bring layers and a warm jacket.")
    if humidity >= 80 and temp_c >= 24:
        parts.append("High humidity — wear breathable, quick-dry clothing.")
    if not parts:
        parts.append(f"Conditions look {condition.lower()} — dress comfortably for outdoor sightseeing.")
    return " ".join(parts)


def _parse_current(data: dict, rain_pct: int) -> WeatherInfo:
    main = data.get("main", {})
    weather = (data.get("weather") or [{}])[0]
    temp_c = round(float(main.get("temp", 0)))
    humidity = int(main.get("humidity", 0))
    condition = weather.get("description", "Unknown").capitalize()
    wmain = weather.get("main", "Clouds")

    return WeatherInfo(
        temperature=f"{temp_c}°C",
        condition=condition,
        rainPrediction=f"{rain_pct}% chance of rain (next 24h)",
        suggestion=_suggestion(condition, temp_c, rain_pct, humidity),
        humidity=f"{humidity}%",
        icon=_map_icon(wmain, temp_c),
    )


async def _fetch_json(client: httpx.AsyncClient, url: str, params: dict) -> Optional[dict]:
    try:
        res = await client.get(url, params=params, timeout=TIMEOUT)
        if res.status_code == 404:
            return None
        res.raise_for_status()
        return res.json()
    except httpx.HTTPError as exc:
        logger.warning("OpenWeather request failed: %s", exc)
        return None


async def _rain_chance_next_24h(client: httpx.AsyncClient, query: str, api_key: str) -> int:
    """Max probability of precipitation in the next ~24 hours (forecast API)."""
    data = await _fetch_json(
        client,
        f"{BASE}/forecast",
        {"q": query, "appid": api_key, "units": "metric", "cnt": 8},
    )
    if not data:
        return 0
    pops = [int(round(float(item.get("pop", 0)) * 100)) for item in data.get("list", [])]
    return max(pops) if pops else 0


async def fetch_live_weather(destination: str) -> Optional[WeatherInfo]:
    """
    Fetch real-time weather for a destination.
    Tries '{destination},IN' first (India-focused app), then bare city name.
    """
    api_key = _api_key()
    if not api_key:
        logger.info("OPENWEATHER_API_KEY not set — skipping live weather")
        return None

    dest = destination.strip()
    if not dest:
        return None

    queries = [f"{dest},IN", dest]

    async with httpx.AsyncClient() as client:
        for query in queries:
            current = await _fetch_json(
                client,
                f"{BASE}/weather",
                {"q": query, "appid": api_key, "units": "metric"},
            )
            if not current:
                continue

            rain_pct = await _rain_chance_next_24h(client, query, api_key)
            # If currently raining, reflect that in the forecast display
            wmain = (current.get("weather") or [{}])[0].get("main", "")
            if wmain in ("Rain", "Drizzle", "Thunderstorm"):
                rain_pct = max(rain_pct, 70)

            info = _parse_current(current, rain_pct)
            logger.info(
                "Live weather for %s (%s): %s, %s",
                dest,
                query,
                info.temperature,
                info.condition,
            )
            return info

    logger.warning("OpenWeather: no data found for destination '%s'", dest)
    return None


async def attach_live_weather(response: TripResponse, destination: str) -> TripResponse:
    """Replace AI/mock weather with OpenWeather data when available."""
    live = await fetch_live_weather(destination)
    if live is None:
        return response
    return response.model_copy(update={"weather": live})

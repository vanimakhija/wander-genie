# backend/ai_service.py
import json
import logging
import os
import asyncio

logger = logging.getLogger(__name__)


def _build_user_prompt(req) -> str:
    if req.budget < 10000:
        budget_level = "budget/backpacker (street food, hostels, local buses)"
    elif req.budget < 50000:
        budget_level = "mid-range (decent restaurants, 3-star hotels, autos/cabs)"
    else:
        budget_level = "luxury (fine dining, 5-star hotels, private transfers)"

    return (
        f"Create a detailed {req.duration}-day travel itinerary for {req.destination}, India.\n"
        f"Budget: Rs {req.budget:,.0f} total ({budget_level})\n"
        f"Interests: {', '.join(req.interests)}\n\n"
        f"CRITICAL INSTRUCTIONS:\n"
        f"- Name REAL, SPECIFIC places that actually exist in {req.destination}\n"
        f"- For beaches: name the actual beach (e.g. 'Palolem Beach', 'Baga Beach')\n"
        f"- For cafes/restaurants: name real ones (e.g. 'Britto's Restaurant', 'Cafe Mosaic')\n"
        f"- For activities: name real landmarks (e.g. 'Basilica of Bom Jesus', 'Dudhsagar Falls')\n"
        f"- Each activity should feel like advice from a local who knows {req.destination} well\n"
        f"- Meals should name specific restaurants or food spots that exist there\n"
        f"- Do NOT give generic responses like 'visit a local beach' - name the actual beach\n\n"
        f"Return ONLY a valid JSON object with no markdown, no explanation, just JSON."
    )


SYSTEM_PROMPT = """You are an expert travel guide for India with deep local knowledge of every city and destination.

You must return a SINGLE valid JSON object. No markdown. No explanation. No code fences. ONLY raw JSON.

JSON structure:
{
  "destination": "<string>",
  "itinerary": [
    {
      "day": <int>,
      "title": "<creative day title>",
      "activities": [
        "<Specific real place name + what to do there + why it is great>",
        "<Specific real place name + what to do there + why it is great>",
        "<Specific real place name + what to do there + why it is great>"
      ],
      "meals": {
        "breakfast": "<Name of real cafe/restaurant + what to order>",
        "lunch": "<Name of real restaurant/food spot + signature dish>",
        "dinner": "<Name of real restaurant + must-try dish>"
      },
      "tips": "<One specific insider tip a local would know>"
    }
  ],
  "packing_list": [
    { "name": "Clothing",        "items": ["<specific item>", "<specific item>", "<specific item>", "<specific item>", "<specific item>"] },
    { "name": "Essentials",      "items": ["<specific item>", "<specific item>", "<specific item>", "<specific item>", "<specific item>"] },
    { "name": "Accessories",     "items": ["<specific item>", "<specific item>", "<specific item>", "<specific item>"] },
    { "name": "Health & Safety", "items": ["<specific item>", "<specific item>", "<specific item>", "<specific item>"] },
    { "name": "Weather-based",   "items": ["<specific item>", "<specific item>", "<specific item>", "<specific item>"] }
  ],
  "weather": {
    "temperature": "<actual typical temperature for this destination>",
    "condition": "<actual typical weather condition>",
    "rainPrediction": "<realistic rain chance>",
    "suggestion": "<specific clothing/gear advice for this destination's weather>",
    "humidity": "<realistic humidity %>",
    "icon": "<sunny | cloudy | rainy | hot>"
  }
}

RULES:
- itinerary must have EXACTLY the number of days requested
- Each activity must name a REAL specific place with enough detail to find it
- Meals must name REAL restaurants or food spots with a dish recommendation
- Packing list must be tailored to the destination climate and the traveller interests
- Weather must reflect the ACTUAL current-season climate of the destination
- Return RAW JSON only"""


async def generate_with_ai(req) -> object:
    from mock_data import generate_mock
    from schemas import TripResponse

    api_key = os.getenv("GROQ_API_KEY", "").strip()
    use_mock = os.getenv("USE_MOCK", "false").lower() == "true"

    # Log what mode we are in so you can see it in the terminal
    logger.info("=" * 50)
    logger.info("GROQ_API_KEY present: %s", bool(api_key and not api_key.startswith("gsk_your")))
    logger.info("USE_MOCK env: %s", use_mock)
    logger.info("=" * 50)

    if use_mock or not api_key or api_key.startswith("gsk_your"):
        logger.warning(">>> USING MOCK DATA — Groq not called <<<")
        logger.warning("Check your .env file has a real GROQ_API_KEY")
        result = generate_mock(req)
        from weather_service import attach_live_weather
        return await attach_live_weather(result, req.destination)

    logger.info(">>> CALLING GROQ LLAMA 3 for: %s (%d days) <<<", req.destination, req.duration)

    try:
        from groq import Groq, GroqError

        client = Groq(api_key=api_key)

        def call_groq():
            return client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                temperature=0.8,
                max_tokens=4096,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user",   "content": _build_user_prompt(req)},
                ],
            )

        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, call_groq)
        raw = (response.choices[0].message.content or "").strip()

        logger.info("Groq raw response (first 200 chars): %s", raw[:200])

        # Strip markdown fences if present
        if "```" in raw:
            parts = raw.split("```")
            for part in parts:
                part = part.strip()
                if part.startswith("json"):
                    part = part[4:].strip()
                if part.startswith("{"):
                    raw = part
                    break

        # Extract JSON even if there is stray text
        start = raw.find("{")
        end = raw.rfind("}") + 1
        if start != -1 and end > start:
            raw = raw[start:end]

        data = json.loads(raw)
        result = _parse_response(data, req)
        logger.info(">>> Groq SUCCESS: %d days generated <<<", len(result.itinerary))
        from weather_service import attach_live_weather
        return await attach_live_weather(result, req.destination)

    except Exception as e:
        logger.error(">>> Groq FAILED: %s — falling back to mock <<<", e, exc_info=True)
        result = generate_mock(req)
        from weather_service import attach_live_weather
        return await attach_live_weather(result, req.destination)


def _parse_response(data: dict, req) -> object:
    from schemas import ItineraryDay, MealPlan, PackingSection, TripResponse, WeatherInfo

    itinerary = []
    for d in data.get("itinerary", []):
        meals_raw = d.get("meals", {})
        meals = (
            MealPlan(
                breakfast=meals_raw.get("breakfast", "Local cafe"),
                lunch=meals_raw.get("lunch", "Street food"),
                dinner=meals_raw.get("dinner", "Restaurant"),
            )
            if meals_raw else None
        )
        itinerary.append(ItineraryDay(
            day=int(d.get("day", len(itinerary) + 1)),
            title=d.get("title", f"Day {len(itinerary) + 1}"),
            activities=d.get("activities", [])[:3],
            meals=meals,
            tips=d.get("tips"),
        ))

    packing_list = [
        PackingSection(name=p["name"], items=p.get("items", []))
        for p in data.get("packing_list", [])
        if p.get("name") and p.get("items")
    ]

    w = data.get("weather", {})
    weather = WeatherInfo(
        temperature=w.get("temperature", "28 degrees C"),
        condition=w.get("condition", "Partly cloudy"),
        rainPrediction=w.get("rainPrediction", "20% chance of rain"),
        suggestion=w.get("suggestion", "Pack light and carry an umbrella."),
        humidity=w.get("humidity", "65%"),
        icon=w.get("icon", "cloudy"),
    )

    return TripResponse(
        destination=req.destination,
        itinerary=itinerary,
        packing_list=packing_list,
        weather=weather,
    )

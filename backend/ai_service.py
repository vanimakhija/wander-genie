# backend/ai_service.py
import json
import logging
import os
import asyncio

logger = logging.getLogger(__name__)


SYSTEM_PROMPT = """You are a world-class AI travel planner with deep local knowledge of destinations worldwide.

You must return a SINGLE valid JSON object. No markdown. No explanation. No code fences. ONLY raw JSON.

JSON structure:
{
  "destination": "<string>",
  "itinerary": [
    {
      "day": <int>,
      "title": "<creative day title>",
      "activities": [
        "<REAL specific place name + what to do + one detail that makes it special>",
        "<REAL specific place name + what to do + one detail that makes it special>",
        "<REAL specific place name + what to do + one detail that makes it special>"
      ],
      "meals": {
        "breakfast": "<Name of REAL cafe or restaurant + what to order>",
        "lunch":     "<Name of REAL restaurant or food spot + signature dish>",
        "dinner":    "<Name of REAL restaurant + must-try dish>"
      },
      "tips": "<One specific insider tip only a local would know>"
    }
  ],
  "packing_list": [
    {
      "name": "Clothing",
      "items": [
        "<clothing specific to DESTINATION climate in TRAVEL MONTH + traveller interests>",
        "<clothing specific to DESTINATION climate in TRAVEL MONTH + traveller interests>",
        "<clothing specific to DESTINATION climate in TRAVEL MONTH + traveller interests>",
        "<clothing specific to DESTINATION climate in TRAVEL MONTH + traveller interests>",
        "<clothing specific to DESTINATION climate in TRAVEL MONTH + traveller interests>"
      ]
    },
    {
      "name": "Essentials",
      "items": [
        "<essential specific to THIS destination and travel month>",
        "<essential specific to THIS destination and travel month>",
        "<essential specific to THIS destination and travel month>",
        "<essential specific to THIS destination and travel month>",
        "<essential specific to THIS destination and travel month>"
      ]
    },
    {
      "name": "Accessories",
      "items": [
        "<accessory for DESTINATION in TRAVEL MONTH + traveller interests>",
        "<accessory for DESTINATION in TRAVEL MONTH + traveller interests>",
        "<accessory for DESTINATION in TRAVEL MONTH + traveller interests>",
        "<accessory for DESTINATION in TRAVEL MONTH + traveller interests>"
      ]
    },
    {
      "name": "Health & Safety",
      "items": [
        "<health item for DESTINATION risks in TRAVEL MONTH>",
        "<health item for DESTINATION risks in TRAVEL MONTH>",
        "<health item for DESTINATION risks in TRAVEL MONTH>",
        "<health item for DESTINATION risks in TRAVEL MONTH>"
      ]
    },
    {
      "name": "Weather-based",
      "items": [
        "<item for ACTUAL weather of DESTINATION in TRAVEL MONTH>",
        "<item for ACTUAL weather of DESTINATION in TRAVEL MONTH>",
        "<item for ACTUAL weather of DESTINATION in TRAVEL MONTH>",
        "<item for ACTUAL weather of DESTINATION in TRAVEL MONTH>"
      ]
    }
  ],
  "weather": {
    "temperature":    "<ACTUAL typical temperature for DESTINATION in TRAVEL MONTH>",
    "condition":      "<ACTUAL typical weather condition in TRAVEL MONTH>",
    "rainPrediction": "<REALISTIC rain chance for DESTINATION in TRAVEL MONTH>",
    "suggestion":     "<Specific clothing or gear advice for DESTINATION in TRAVEL MONTH>",
    "humidity":       "<realistic humidity %>",
    "icon":           "<sunny | cloudy | rainy | hot>"
  }
}

CRITICAL RULES:
1. itinerary must have EXACTLY the requested number of days.
2. Each activity must name a REAL specific place — never say 'visit a local beach', say 'visit Palolem Beach'.
3. Meals must name REAL restaurants with a dish recommendation.
4. Packing list must be tailored to:
   - DESTINATION + TRAVEL MONTH combination (e.g. Goa in June = monsoon season, pack rain gear not swimwear)
   - Traveller INTERESTS (beaches = reef-safe sunscreen, mountains = hiking boots)
   - BUDGET level
5. Weather must reflect ACTUAL climate of the destination IN THE SPECIFIC TRAVEL MONTH.
   Examples:
   - Goa in June-September = heavy monsoon, very rainy, humid
   - Goa in November-February = perfect weather, sunny and cool
   - Bali in July-August = dry season, best time to visit
   - Bali in January-February = wet season, frequent rain
   - Iceland in June-August = midnight sun, mild weather
   - Iceland in December-February = polar night, extremely cold, northern lights
   - Paris in December = cold 5 degrees C, possibly snowy
   - Paris in July = warm 25 degrees C, sunny
6. NEVER give generic items — always be destination and month specific.
7. Return RAW JSON only — no markdown, no backticks, no preamble."""


def _build_user_prompt(req) -> str:
    if req.budget < 10000:
        budget_level = "budget/backpacker (street food, hostels, local transport)"
    elif req.budget < 50000:
        budget_level = "mid-range (good restaurants, 3-star hotels, taxis)"
    else:
        budget_level = "luxury (fine dining, 5-star hotels, private transfers)"

    return (
        f"Plan a {req.duration}-day trip to {req.destination}.\n"
        f"Travel month: {req.travel_month}\n"
        f"Total budget: Rs {req.budget:,.0f} ({budget_level})\n"
        f"Traveller interests: {', '.join(req.interests)}\n\n"
        f"WEATHER INSTRUCTION:\n"
        f"Research the ACTUAL weather in {req.destination} during {req.travel_month}.\n"
        f"For example: Is it monsoon season? Dry season? Cold? Hot? Humid?\n"
        f"Give realistic weather data for {req.destination} in {req.travel_month}.\n\n"
        f"PACKING LIST INSTRUCTION:\n"
        f"Pack for {req.destination} in {req.travel_month} — not generic packing.\n"
        f"Consider: actual climate in {req.travel_month}, local health risks, culture, "
        f"and interests: {', '.join(req.interests)}.\n"
        f"If {req.travel_month} is monsoon/rainy season at {req.destination}, pack rain gear not beach gear.\n\n"
        f"ITINERARY INSTRUCTION:\n"
        f"Name REAL specific places and restaurants in {req.destination}.\n"
        f"Consider what activities are suitable in {req.travel_month} at {req.destination}.\n\n"
        f"Return ONLY the JSON object."
    )


async def generate_with_ai(req) -> object:
    from mock_data import generate_mock

    api_key  = os.getenv("GROQ_API_KEY", "").strip()
    use_mock = os.getenv("USE_MOCK", "false").lower() == "true"

    logger.info("=" * 50)
    logger.info("GROQ_API_KEY present: %s", bool(api_key and not api_key.startswith("gsk_your")))
    logger.info("USE_MOCK: %s", use_mock)
    logger.info("Destination: %s | Month: %s | Days: %d",
                req.destination, getattr(req, 'travel_month', 'N/A'), req.duration)
    logger.info("=" * 50)

    if use_mock or not api_key or api_key.startswith("gsk_your"):
        logger.warning(">>> USING MOCK DATA <<<")
        return generate_mock(req)

    logger.info(">>> CALLING GROQ for: %s in %s (%d days) <<<",
                req.destination, getattr(req, 'travel_month', '?'), req.duration)

    try:
        from groq import Groq

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

        logger.info("Groq raw (first 200 chars): %s", raw[:200])

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

        start = raw.find("{")
        end   = raw.rfind("}") + 1
        if start != -1 and end > start:
            raw = raw[start:end]

        data   = json.loads(raw)
        
        # Log packing list from Groq
        packing_from_groq = data.get("packing_list", [])
        logger.info("Groq packing_list sections: %d", len(packing_from_groq))
        for section in packing_from_groq:
            items_count = len(section.get("items", []))
            logger.info("  - %s: %d items", section.get("name", "?"), items_count)
        
        result = _parse_response(data, req)
        logger.info(">>> Groq SUCCESS: %d days, %d packing sections <<<", 
                   len(result.itinerary), len(result.packing_list))
        return result

    except Exception as e:
        logger.error(">>> Groq FAILED: %s — falling back to mock <<<", e, exc_info=True)
        from mock_data import generate_mock
        return generate_mock(req)


def _parse_response(data: dict, req) -> object:
    from schemas import ItineraryDay, MealPlan, PackingSection, TripResponse, WeatherInfo

    itinerary = []
    for d in data.get("itinerary", []):
        meals_raw = d.get("meals", {})
        meals = (
            MealPlan(
                breakfast=meals_raw.get("breakfast", "Local cafe breakfast"),
                lunch=meals_raw.get("lunch",     "Street food"),
                dinner=meals_raw.get("dinner",   "Restaurant dinner"),
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
    
    # Fallback: if Groq didn't return a proper packing list, use mock
    if not packing_list or len(packing_list) == 0:
        logger.warning("Groq packing_list was empty or malformed — using mock packing list")
        from mock_data import build_packing_list
        packing_list = build_packing_list(req.interests)
    else:
        # Validate that sections have items
        valid_sections = []
        for section in packing_list:
            if section.items and len(section.items) > 0:
                valid_sections.append(section)
            else:
                logger.warning("Packing section '%s' has no items — skipping", section.name)
        
        if not valid_sections:
            logger.warning("All packing sections were empty — using mock packing list")
            from mock_data import build_packing_list
            packing_list = build_packing_list(req.interests)
        else:
            packing_list = valid_sections

    w = data.get("weather", {})
    weather = WeatherInfo(
        temperature=   w.get("temperature",    "28 degrees C"),
        condition=     w.get("condition",      "Partly cloudy"),
        rainPrediction=w.get("rainPrediction", "20% chance of rain"),
        suggestion=    w.get("suggestion",     "Pack light and carry an umbrella."),
        humidity=      w.get("humidity",       "65%"),
        icon=          w.get("icon",           "cloudy"),
    )

    return TripResponse(
        destination= req.destination,
        itinerary=   itinerary,
        packing_list=packing_list,
        weather=     weather,
    )
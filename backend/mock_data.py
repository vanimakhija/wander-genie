# backend/mock_data.py
"""
Rich mock data — used when USE_MOCK=true OR when the OpenAI call fails.
This means the app always works, even without an API key.
"""
from schemas import TripRequest, TripResponse, ItineraryDay, MealPlan, PackingSection, WeatherInfo

DAY_TITLES = [
    "Arrival & First Impressions",
    "Culture & Local Exploration",
    "Adventure Day",
    "Hidden Gems & Local Life",
    "Leisure & Slow Travel",
    "Off the Beaten Path",
    "Farewell & Highlights",
]

ACTIVITY_SETS = [
    ["Morning walk through the old quarter", "Visit the central market", "Sunset at the waterfront viewpoint"],
    ["Guided heritage walk with a local expert", "Authentic cooking class", "Rooftop dinner with city views"],
    ["Day trip to a nearby nature reserve", "Kayaking or hiking trail", "Stargazing at a hilltop viewpoint"],
    ["Explore artisan workshops & craft bazaars", "Street food tasting tour", "Live music or jazz bar night"],
    ["Slow spa morning or beach walk", "Boutique shopping district", "Farm-to-table farewell dinner"],
    ["Sunrise yoga session", "Temple or monastery visit", "Riverside café evening"],
    ["Coastal walk at dawn", "Snorkelling or water sports", "Beachside bonfire dinner"],
]

MEAL_SETS = [
    MealPlan(breakfast="Hotel breakfast or local café", lunch="Street food market", dinner="Waterfront restaurant"),
    MealPlan(breakfast="Fresh fruit smoothie bowl", lunch="Traditional local cuisine", dinner="Rooftop bistro"),
    MealPlan(breakfast="Bakery croissant & coffee", lunch="Trailhead picnic", dinner="Farm-to-table experience"),
    MealPlan(breakfast="Hole-in-the-wall noodle stall", lunch="Night market preview", dinner="Fine-dining splurge"),
    MealPlan(breakfast="Brunch at artisan café", lunch="Beachside snacks", dinner="Farewell feast"),
]

TIPS = [
    "Book popular restaurants at least 2 days ahead.",
    "Carry local cash — many vendors don't accept cards.",
    "Start early to beat the midday heat and crowds.",
    "Download an offline map before heading out.",
    "Ask your hotel for a local SIM card recommendation.",
    "Negotiate respectfully at local markets.",
    "Try the local speciality at every meal stop.",
]

WEATHER_PROFILES = {
    "goa":      WeatherInfo(temperature="32°C", condition="Sunny with coastal breeze", rainPrediction="15% chance of light rain", suggestion="Mostly sunny — pack sunscreen and sunglasses.", humidity="78%", icon="sunny"),
    "bali":     WeatherInfo(temperature="30°C", condition="Tropical showers likely", rainPrediction="60% chance of rain", suggestion="Pack a waterproof jacket and quick-dry footwear.", humidity="85%", icon="rainy"),
    "paris":    WeatherInfo(temperature="18°C", condition="Mild and partly cloudy", rainPrediction="30% chance of light showers", suggestion="A compact umbrella and light jacket are a good idea.", humidity="65%", icon="cloudy"),
    "tokyo":    WeatherInfo(temperature="22°C", condition="Clear skies, pleasant", rainPrediction="20% chance of rain", suggestion="Great weather for walking — bring sunscreen.", humidity="55%", icon="sunny"),
    "maldives": WeatherInfo(temperature="31°C", condition="Sunny with sea breeze", rainPrediction="10% chance of rain", suggestion="Reef-safe sunscreen is a must for outdoor activities.", humidity="80%", icon="sunny"),
    "dubai":    WeatherInfo(temperature="38°C", condition="Hot and very dry", rainPrediction="5% chance of rain", suggestion="Stay hydrated — carry water everywhere in this heat.", humidity="30%", icon="hot"),
    "manali":   WeatherInfo(temperature="12°C", condition="Cool with clear mountain air", rainPrediction="25% chance of drizzle", suggestion="Layer up — mornings and evenings get very cold.", humidity="60%", icon="cloudy"),
}

DEFAULT_WEATHER = WeatherInfo(
    temperature="28°C",
    condition="Mostly pleasant with light clouds",
    rainPrediction="25% chance of light rain",
    suggestion="Light rain possible — carry an umbrella and comfortable footwear.",
    humidity="65%",
    icon="cloudy",
)


def build_packing_list(interests: list[str]) -> list[PackingSection]:
    clothing = [
        "Lightweight breathable shirts (5–6)",
        "Comfortable walking shorts / pants",
        "Smart-casual outfit for dinners",
        "Compact travel jacket or cardigan",
        "Comfortable walking shoes",
    ]
    if "beaches" in interests:
        clothing += ["Swimwear (2 sets)", "Water-resistant sandals"]
    if "mountains" in interests:
        clothing += ["Moisture-wicking trekking socks", "Sturdy hiking boots"]
    if "nightlife" in interests:
        clothing.append("One formal / party outfit")
    if "culture" in interests:
        clothing.append("Modest cover-up for temples / churches")

    weather_items = ["SPF 50 sunscreen", "Compact travel umbrella", "Waterproof footwear", "Insect repellent"]
    if "mountains" in interests:
        weather_items += ["Thermal inner layer", "Woollen hat & gloves"]
    if "beaches" in interests:
        weather_items.append("Reef-safe sunscreen")

    return [
        PackingSection(name="Clothing",        items=clothing),
        PackingSection(name="Essentials",      items=["Universal travel adapter", "Portable power bank (20 000 mAh)", "Copies of passport & ID", "Reusable water bottle", "Noise-cancelling earbuds"]),
        PackingSection(name="Accessories",     items=["Polarised sunglasses", "Day backpack (20–25 L)", "Travel neck pillow", "Foldable tote bag"]),
        PackingSection(name="Health & Safety", items=["Basic first-aid kit", "Hand sanitiser", "Prescription medications (2× supply)", "Face masks"]),
        PackingSection(name="Weather-based",   items=weather_items),
    ]


def generate_mock(req: TripRequest) -> TripResponse:
    """Return a rich mock response matching the real API contract."""
    days = []
    for i in range(req.duration):
        acts = ACTIVITY_SETS[i % len(ACTIVITY_SETS)]
        # Personalise first activity
        acts = [acts[0].replace("the old quarter", f"{req.destination}'s old quarter")] + acts[1:]
        days.append(ItineraryDay(
            day=i + 1,
            title=DAY_TITLES[i % len(DAY_TITLES)],
            activities=acts,
            meals=MEAL_SETS[i % len(MEAL_SETS)],
            tips=TIPS[i % len(TIPS)],
        ))

    weather = WEATHER_PROFILES.get(req.destination.strip().lower(), DEFAULT_WEATHER)

    return TripResponse(
        destination=req.destination,
        itinerary=days,
        packing_list=build_packing_list(req.interests),
        weather=weather,
    )

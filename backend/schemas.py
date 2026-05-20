# backend/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional


class TripRequest(BaseModel):
    destination: str  = Field(..., min_length=1, max_length=100, example="Goa")
    budget:      float = Field(..., gt=0, example=20000)
    duration:    int   = Field(..., ge=1, le=30, example=5)
    interests:   List[str] = Field(..., min_length=1, example=["beaches", "cafes"])
    travel_month: str = Field(default="June", example="December")


class MealPlan(BaseModel):
    breakfast: str
    lunch:     str
    dinner:    str


class ItineraryDay(BaseModel):
    day:        int
    title:      str
    activities: List[str]
    meals:      Optional[MealPlan] = None
    tips:       Optional[str]      = None


class PackingSection(BaseModel):
    name:  str
    items: List[str]


class WeatherInfo(BaseModel):
    temperature:   str
    condition:     str
    rainPrediction:str
    suggestion:    str
    humidity:      Optional[str] = None
    icon:          Optional[str] = None


class TripResponse(BaseModel):
    destination:  str
    itinerary:    List[ItineraryDay]
    packing_list: List[PackingSection]
    weather:      WeatherInfo


class ShareTripPayload(BaseModel):
    form:   TripRequest
    result: TripResponse


class ShareLinkResponse(BaseModel):
    share_id:   str
    share_path: str
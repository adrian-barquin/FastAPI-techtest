from typing import List
from pydantic import BaseModel, EmailStr
from schemas.vehicle import VehicleOut

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    age: int | None
    active: bool = True

class UserWithInactiveVehicles(BaseModel):
    id: int
    name: str
    email: str
    vehicles: list[VehicleOut]

    model_config= {"from_attributes": True}

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    age: int | None
    active: bool

    model_config = {"from_attributes": True}

class UserDeleteRequest(BaseModel):
    ids: List[int]
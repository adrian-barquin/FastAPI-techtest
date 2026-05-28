from pydantic import BaseModel
from typing import Optional

class VehicleOut(BaseModel):
    id: int
    color: str | None
    active: bool
    model_config = {"from_attributes": True}

class CarCreate(BaseModel):
    user_id: int
    color: str | None = None
    active: bool = True
    plate: str
    capacity: int | None = None
    electrical: bool | None = None

class CarUpdate(BaseModel):
    color: Optional[str] = None
    active: Optional[bool] = None
    plate: Optional[str] = None
    capacity: Optional[int] = None
    electrical: Optional[bool] = None

class CarOut(BaseModel):
    id: int
    user_id: int
    color: str | None
    active: bool
    plate: str
    capacity: int | None
    electrical: bool | None
    model_config = {"from_attributes": True}

class BikeCreate(BaseModel):
    user_id: int
    color: str | None = None
    active: bool = True
    basket: bool | None = None
    type_id: int | None = None

class BikeUpdate(BaseModel):
    color: Optional[str] = None
    active: Optional[bool] = None
    basket: Optional[bool] = None
    type_id: Optional[int] = None

class BikeOut(BaseModel):
    id: int
    user_id: int
    color: str | None
    active: bool
    basket: bool | None
    type_id: int | None
    model_config = {"from_attributes": True}

class TypeCreate(BaseModel):
    description: str

class TypeOut(BaseModel):
    id: int
    description: str
    model_config = {"from_attributes": True}
from fastapi import APIRouter, status, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from database.session import get_db
from models.car import Car
from models.bike import Bike
from models.type import Type
from models.user import User
from schemas.vehicle import CarCreate, CarOut, BikeCreate, BikeOut, TypeCreate, TypeOut, CarUpdate, BikeUpdate
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/vehicles", tags=["vehicles"])

class VehicleDeleteRequest(BaseModel):
    ids: List[int]

@router.get("/cars", response_model=list[CarOut])
async def list_cars(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Car))
    return result.scalars().all()

@router.post("/cars", response_model=CarOut, status_code=status.HTTP_201_CREATED)
async def create_car(car: CarCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == car.user_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    new_car = Car(**car.model_dump())
    db.add(new_car)
    await db.commit()
    await db.refresh(new_car)
    return new_car

@router.patch("/cars/{car_id}", response_model=CarOut)
async def update_car(car_id: int, car: CarUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Car).where(Car.id == car_id))
    existing = result.scalar_one_or_none()
    if not existing:
        raise HTTPException(status_code=404, detail="Coche no encontrado")
    for field, value in car.model_dump(exclude_unset=True).items():
        setattr(existing, field, value)
    await db.commit()
    await db.refresh(existing)
    return existing

@router.delete("/cars", status_code=200)
async def delete_cars(payload: VehicleDeleteRequest = Body(...), db: AsyncSession = Depends(get_db)):
    if not payload.ids:
        raise HTTPException(status_code=400, detail="No se han proporcionado IDs")
    result = await db.execute(delete(Car).where(Car.id.in_(payload.ids)))
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="No se encontraron coches con esos IDs")
    await db.commit()
    return {"deleted": result.rowcount}

@router.get("/bikes", response_model=list[BikeOut])
async def list_bikes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Bike))
    return result.scalars().all()

@router.post("/bikes", response_model=BikeOut, status_code=status.HTTP_201_CREATED)
async def create_bike(bike: BikeCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == bike.user_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    new_bike = Bike(**bike.model_dump())
    db.add(new_bike)
    await db.commit()
    await db.refresh(new_bike)
    return new_bike

@router.patch("/bikes/{bike_id}", response_model=BikeOut)
async def update_bike(bike_id: int, bike: BikeUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Bike).where(Bike.id == bike_id))
    existing = result.scalar_one_or_none()
    if not existing:
        raise HTTPException(status_code=404, detail="Bicicleta no encontrada")
    for field, value in bike.model_dump(exclude_unset=True).items():
        setattr(existing, field, value)
    await db.commit()
    await db.refresh(existing)
    return existing

@router.delete("/bikes", status_code=200)
async def delete_bikes(payload: VehicleDeleteRequest = Body(...), db: AsyncSession = Depends(get_db)):
    if not payload.ids:
        raise HTTPException(status_code=400, detail="No se han proporcionado IDs")
    result = await db.execute(delete(Bike).where(Bike.id.in_(payload.ids)))
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="No se encontraron bicis con esos IDs")
    await db.commit()
    return {"deleted": result.rowcount}

@router.get("/types", response_model=list[TypeOut])
async def list_types(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Type))
    return result.scalars().all()

@router.post("/types", response_model=TypeOut, status_code=status.HTTP_201_CREATED)
async def create_type(type_data: TypeCreate, db: AsyncSession = Depends(get_db)):
    new_type = Type(**type_data.model_dump())
    db.add(new_type)
    await db.commit()
    await db.refresh(new_type)
    return new_type
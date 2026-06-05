from fastapi import APIRouter, status, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload

from schemas.user import UserOut, UserDeleteRequest, UserCreate, UserWithInactiveVehicles
from database.session import get_db
from models.user import User
from models.vehicle import Vehicle
from core.logging import logger
from schemas.user import UserCreate

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate,db: AsyncSession = Depends(get_db)):
    new_user = User(**user.model_dump())
    db.add(new_user)

    await db.commit()
    await db.refresh(new_user)

    logger.info(f"Usuario creado con id {new_user.id}")
    return new_user

@router.get("/active-with-inactive-vehicles", response_model=list[UserWithInactiveVehicles])
async def get_active_users_with_inactive_vehicles(db: AsyncSession = Depends(get_db)):
    stmt = (
        select(User).distinct().join 
        (Vehicle, (Vehicle.user_id==User.id) & (Vehicle.active.is_(False)))
        .where(User.active.is_(True)).options(selectinload(User.vehicles.and_(Vehicle.active.is_(False))))
    )
    result = await db.execute(stmt)
    users = result.scalars().all()
    return users

@router.get("/", response_model=list[UserOut], summary="Listar usuarios", description="Todos los usuarios registrados, sin tener en cuenta si tienen vehiculo o no")
async def list_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users

@router.delete("/", status_code=200)
async def delete_users(
    payload: UserDeleteRequest = Body(...),
    db: AsyncSession = Depends(get_db)
):
    if not payload.ids:
        raise HTTPException(status_code=400, detail="No se han proporcionado IDs para eliminar")
    stmt = delete(User).where(User.id.in_(payload.ids))
    result = await db.execute(stmt)

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="No se encontró ningún usuario con esos IDs")   
    await db.commit()
    return {"deleted": result.rowcount}

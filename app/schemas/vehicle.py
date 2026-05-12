from pydantic import BaseModel

class VehicleOut(BaseModel):
    id:int
    color: str | None
    active: bool

    model_config= {"from_attributes": True}     # return sqlalchemy_object
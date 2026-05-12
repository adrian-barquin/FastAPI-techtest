from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from models.vehicle import Vehicle

class Car(Vehicle):
    __tablename__ = "cars"

    __mapper_args__ = {
        "polymorphic_identity": "car"
    }

    id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"), primary_key=True)
    plate: Mapped[str] = mapped_column(String(30), nullable=False)
    capacity: Mapped[int | None]
    electrical: Mapped[bool | None]
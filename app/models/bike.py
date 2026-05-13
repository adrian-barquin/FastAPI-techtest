from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.vehicle import Vehicle

class Bike(Vehicle):
    __tablename__ = "bikes"

    __mapper_args__ = {
        "polymorphic_identity": "bike"
    }

    id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"), primary_key=True)
    basket: Mapped[bool | None]
    type_id: Mapped[int] = mapped_column(ForeignKey("types.id"))

    byke_type = relationship("Type")

    def __repr__(self) -> str:
        return f"<Bike id={self.id} basket={self.basket}>"
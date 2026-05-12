from typing import TYPE_CHECKING
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database.base import Base

if TYPE_CHECKING:
    from models.user import User

class Vehicle(Base):
    __tablename__="vehicle"

    __mapper_args__={
        "polymorphic_on":"type",
        "polymorphic_identity":"vehicle"
    }

    type: Mapped[str] = mapped_column(String(50))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    color: Mapped[str | None]
    active: Mapped[bool] = mapped_column(Boolean, nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="vehicles")

    def __repr__(self) -> str:
        return f"<Vehicle id={self.id} type={self.type} active={self.active}>"
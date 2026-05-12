from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database.base import Base

class User(Base):
    __tablename__="user"

    name: Mapped[str]=mapped_column(String(50), nullable=False)     # columna not null
    email: Mapped[str]=mapped_column(String(200), nullable=False, unique=True)  # columna not null, valor unique
    phone: Mapped[str]
    age: Mapped[int | None]
    active: Mapped[bool] = mapped_column(Boolean, nullable=False)

    vehicles=relationship (
        "Vehicle",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} active={self.active}"
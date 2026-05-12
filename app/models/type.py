from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from database.base import Base

class Type(Base):
    __tablename__ = "types"

    description: Mapped[str] = mapped_column(String(150), nullable=False)

    def __repr__(self) -> str:
        return f"<Type id={self.id} description={self.description}>"
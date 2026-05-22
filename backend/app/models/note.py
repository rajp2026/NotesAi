from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Note(Base):

    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    title: Mapped[str | None] = mapped_column(String, nullable=True)

    original_file_url: Mapped[str] = mapped_column(String)

    generated_pdf_url: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String,
        default="UPLOADED"
    )
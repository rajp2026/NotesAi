from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import Enum as SQLAlchemyEnum

from app.core.database import Base
from app.models.enums import NoteStatus


class Note(Base):

    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    title: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )

    original_file_url: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    generated_pdf_url: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )

    extracted_text: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    error_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    status: Mapped[NoteStatus] = mapped_column(

        SQLAlchemyEnum(
            NoteStatus,
            name="note_status"
        ),

        default=NoteStatus.UPLOADED,

        nullable=False
    )
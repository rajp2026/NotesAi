from app.db.session import engine
from app.models.note import Note
from app.db.session import Base

Base.metadata.create_all(bind=engine)
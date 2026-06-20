import os
import uuid
import shutil


class LocalStorageService:

    UPLOAD_DIR = "storage/uploads"


    @classmethod
    def save_file(cls, file):
        os.makedirs(cls.UPLOAD_DIR, exist_ok=True)

        unique_filename = (
            f"{uuid.uuid4()}_{file.filename}"
        )

        file_path = os.path.join(
            cls.UPLOAD_DIR,
            unique_filename
        )

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(file.file, buffer)

        return file_path
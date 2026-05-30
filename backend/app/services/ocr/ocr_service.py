import os
import platform

import cv2
import pytesseract

from PIL import Image


# On Windows, tesseract isn't on PATH by default
if platform.system() == "Windows":
    _win_path = (
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )
    if os.path.exists(_win_path):
        pytesseract.pytesseract.tesseract_cmd = _win_path
# On Linux (Docker), tesseract is in PATH after apt install


class OCRService:


    @staticmethod
    def extract_text(
        file_path: str
    ) -> str:

        print(f"OCR STARTED: {file_path}")

        image = cv2.imread(file_path)

        if image is None:
            raise ValueError(
                f"Could not read image: {file_path}"
            )

        # grayscale
        gray = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2GRAY
        )

        # threshold
        thresh = cv2.threshold(
            gray,
            150,
            255,
            cv2.THRESH_BINARY
        )[1]

        pil_image = Image.fromarray(thresh)

        extracted_text = pytesseract.image_to_string(
            pil_image
        )
        return extracted_text
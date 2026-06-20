import asyncio

from app.services.ocr.ocr_service import (
    OCRService
)


async def main():

    text = await OCRService.extract_text(
        "storage/uploads/testing.png"
    )

    print(text)


asyncio.run(main())
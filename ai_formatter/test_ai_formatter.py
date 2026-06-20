import asyncio

from app.services.ai.ai_formatter_service import (
    AIFormatterService
)


dummy_text = """
newtns first law sayssss objectttt rema in res or moton unles externalllll forceeeee acts

formula:
f = ma

types of energy
kinetic
potential
"""


async def main():

    formatted_text = (
        await AIFormatterService.format_notes(
            dummy_text
        )
    )
    breakpoint()
    print("\nFORMATTED TEXT:\n")

    print(formatted_text)


asyncio.run(main())
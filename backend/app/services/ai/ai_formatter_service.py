from openai import OpenAI
# import os
from app.core.config import settings


client = OpenAI(
    api_key=settings.OPENAI_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)




class AIFormatterService:

    @staticmethod
    async def format_notes(
        extracted_text: str
    ) -> str:

        prompt = f"""
You are an intelligent notes formatter.

Convert OCR extracted handwritten notes into:

- clean markdown
- proper headings
- bullet points
- readable study notes
- fix OCR spelling mistakes
- preserve formulas
- preserve important concepts

OCR TEXT:

{extracted_text}
"""

        try:

            response = client.chat.completions.create(

                model="openai/gpt-oss-20b",

                messages=[

                    {
                        "role": "system",
                        "content": (
                            "You are a professional "
                            "academic notes formatter."
                        )
                    },

                    {
                        "role": "user",
                        "content": prompt
                    }
                ],

                temperature=0.2
            )

            formatted_text = (
                response.choices[0]
                .message
                .content
            )

            return formatted_text

        except Exception as e:

            print("AI Formatting Error:", str(e))

            return extracted_text
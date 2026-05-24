import os
import uuid

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import (
    getSampleStyleSheet
)

from reportlab.lib.pagesizes import letter


PDF_DIR = "storage/pdfs"

os.makedirs(
    PDF_DIR,
    exist_ok=True
)


class PDFService:


    @staticmethod
    def generate_pdf(
        text: str
    ) -> str:

        filename = (
            f"{uuid.uuid4()}.pdf"
        )

        pdf_path = os.path.join(
            PDF_DIR,
            filename
        )

        doc = SimpleDocTemplate(

            pdf_path,

            pagesize=letter
        )

        styles = getSampleStyleSheet()

        elements = []

        paragraphs = text.split("\n")


        for para in paragraphs:

            if para.strip():

                elements.append(

                    Paragraph(
                        para,
                        styles["BodyText"]
                    )
                )

                elements.append(
                    Spacer(1, 12)
                )


        doc.build(elements)

        return pdf_path
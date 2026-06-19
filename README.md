NotesAI - Handwritten Notes to PDF Generator

NotesAI is a highly scalable, microservices-based application designed to convert messy, handwritten notes into clean, well-formatted,
professional PDF study materials. It leverages OCR technology and Large Language Models to extract text, fix spelling errors, format markdown, 
and generate final PDFs.

✨ Features
Automated OCR Pipeline: Upload an image of your notes and let the system automatically extract the raw text using Tesseract.
AI Formatting: Uses Groq/OpenAI to instantly transform raw, error-prone OCR text into beautifully formatted markdown, preserving headings, bullet points,and formulas.
PDF Generation: Automatically converts the formatted markdown into a downloadable, academic-style PDF via ReportLab.
Real-Time WebSocket Updates: Track your document's progress through the pipeline stages in real-time on the frontend.
Microservices Architecture: Highly scalable, decoupled architecture using Kafka for event-driven asynchronous processing.

🏗️ Architecture
The application is composed of 5 distinct, containerized microservices communicating via Apache Kafka:

Frontend: Vite + React 19 SPA with Tailwind CSS 4.
Backend: FastAPI API gateway handling HTTP uploads, WebSockets, and database operations.
OCR Service: Kafka consumer that runs Tesseract OCR on uploaded images.
AI Formatter Service: Kafka consumer that calls the Groq LLM API to format text.
PDF Formatter Service: Kafka consumer that generates the final PDF and uploads it to AWS S3.
Data Flow
Image Upload -> Backend -> [Kafka] -> OCR Service -> [Kafka] -> AI Service -> [Kafka] -> PDF Service -> AWS S3

🛠️ Tech Stack
Frontend: React, Vite, Tailwind CSS, Axios
Backend / Services: Python 3.11, FastAPI, SQLAlchemy (AsyncPG)
Message Broker: Apache Kafka & Zookeeper
Database: PostgreSQL 16
Storage: AWS S3 (Production), Local Volume (Development)
Infrastructure: Docker, AWS ECS, EC2, ECR, GitHub Actions

🚀 Local Development Setup
To run the entire microservices cluster locally, you only need Docker and Docker Compose.

1. Clone the repository
   git clone https://github.com/yourusername/NotesAI.git
   cd NotesAI
3. Environment Variables
  Copy the root environment template and fill in your keys:
  cp .env.example .env
Ensure you provide your OPENAI_API_KEY (Groq key) and AWS credentials.

Copy the frontend environment template:

cd frontend
cp .env.example .env
cd ..
3. Run with Docker Compose
From the root directory, start all services: docker-compose up --build

The Frontend will be available at http://localhost:5173
The Backend API will be available at http://localhost:8000

bash

docker-compose up --build

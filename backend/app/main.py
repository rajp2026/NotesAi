from fastapi import FastAPI
from app.api.v1.routes.upload import router as upload_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Notes PDF Generator",
    version = "1.0.0" 
)
app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

@app.get('/')
def root():
    return {
        "msg": "Backed running"
    }

@app.get("/health")
def health_check():
    return {
        "msg":"healthy"
    }

app.include_router(
    upload_router,
    prefix="/api/v1",
    tags=["Notes"]
)
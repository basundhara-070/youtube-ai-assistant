from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from rag import YouTubeRAG
from models import (
    VideoRequest,
    ChatRequest,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize only when required
rag = None


@app.get("/")
def home():

    return {
        "message": "Backend Running"
    }


@app.post("/process-video")
def process_video(request: VideoRequest):

    global rag

    if rag is None:
        rag = YouTubeRAG()

    rag.process_video(request.url)

    return {
        "status": "success"
    }


@app.post("/chat")
def chat(request: ChatRequest):

    global rag

    if rag is None:
        return {
            "answer": "Please process a video first."
        }

    answer = rag.ask(request.question)

    return {
        "answer": answer
    }
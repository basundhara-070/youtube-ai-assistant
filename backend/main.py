from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import TranscriptRequest, ChatRequest
from rag import YouTubeRAG

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rag = YouTubeRAG()


@app.get("/")
def home():
    return {
        "message": "Backend Running"
    }


@app.post("/process-transcript")
def process_transcript(request: TranscriptRequest):

    try:
        if not request.transcript or not request.transcript.strip():
            raise HTTPException(
                status_code=400,
                detail="Transcript is empty.",
            )

        rag.process_transcript(request.transcript)

        return {
            "status": "success"
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@app.post("/chat")
def chat(request: ChatRequest):

    try:

        answer = rag.ask(request.question)

        return {
            "answer": answer
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )
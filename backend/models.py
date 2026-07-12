from pydantic import BaseModel


class TranscriptRequest(BaseModel):
    transcript: str


class ChatRequest(BaseModel):
    question: str
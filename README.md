# YouTube AI Assistant

YouTube AI Assistant is a full-stack application that lets users paste a YouTube video URL, process its transcript, and ask questions about the video content through a retrieval-augmented generation (RAG) workflow.

## Architecture Overview

The system is split into three main layers:

1. Frontend
   - Built with Next.js and React.
   - Handles the user interface for entering a YouTube URL and chatting with the assistant.
   - Communicates with the backend through HTTP requests.

2. Backend API
   - Built with FastAPI.
   - Exposes endpoints for processing a video and answering questions.
   - Uses Pydantic models for request validation.

3. RAG Pipeline
   - Uses the YouTube transcript API to retrieve captions.
   - Splits the transcript into chunks.
   - Creates embeddings and stores them in a FAISS vector store.
   - Uses a Hugging Face language model to answer questions grounded in the transcript.

## High-Level Flow

1. The user pastes a YouTube URL in the frontend.
2. The frontend sends the URL to the backend `/process-video` endpoint.
3. The backend downloads the transcript, builds a vector index, and prepares the retrieval pipeline.
4. The user asks a question through the chat interface.
5. The backend uses the retriever and language model to return an answer based on the transcript.

## Project Structure

```text
.
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── rag.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── services/
│   ├── package.json
│   └── next.config.mjs
├── chatmodel_api.py
├── requirements.txt
└── .gitignore
```

## Backend Components

- `backend/main.py`
  - FastAPI entry point.
  - Defines the `/` health route, `/process-video`, and `/chat` endpoints.

- `backend/models.py`
  - Contains the request models for video processing and chat.

- `backend/rag.py`
  - Implements the YouTube transcript extraction, chunking, vector indexing, and question-answering logic.

## Frontend Components

- `frontend/src/app/page.js`
  - Main page component that wires together the URL input, status display, and chat experience.

- `frontend/src/components/`
  - Contains reusable UI pieces such as the URL input, chat box, messages, navbar, and status banner.

- `frontend/src/services/api.js`
  - Axios client used to call the FastAPI backend.

## API Endpoints

- `GET /`
  - Returns a simple health message.

- `POST /process-video`
  - Accepts a YouTube URL and prepares the transcript-based retrieval pipeline.

- `POST /chat`
  - Accepts a question and returns an answer generated from the indexed transcript.

## Local Development

### 1. Python backend

From the project root:

```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows PowerShell
pip install -r requirements.txt
pip install -r backend/requirements.txt
```

Start the backend:

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### 2. Frontend

From the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:3000` and expects the backend at `http://127.0.0.1:8000`.

## Environment Notes

The backend loads environment variables with `python-dotenv`. If your deployment or model provider requires additional configuration, place the values in a `.env` file at the project root.

## Notes

This project combines a modern web frontend with a Python-based AI backend. The overall design is intentionally simple: a small FastAPI service for orchestration, a retrieval pipeline for grounding responses in transcript content, and a React/Next.js interface for user interaction.

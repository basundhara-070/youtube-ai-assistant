from urllib.parse import urlparse, parse_qs

from youtube_transcript_api import YouTubeTranscriptApi

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import (
    HuggingFaceEndpointEmbeddings,
    HuggingFaceEndpoint,
    ChatHuggingFace,
)
from langchain_community.vectorstores import FAISS

from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import (
    RunnableParallel,
    RunnablePassthrough,
    RunnableLambda,
)
from langchain_core.output_parsers import StrOutputParser

from dotenv import load_dotenv

load_dotenv()


class YouTubeRAG:

    def __init__(self):

        self.chain = None
        self.embeddings = None
        self.model = None

    def initialize_models(self):

        if self.embeddings is None:

            self.embeddings = HuggingFaceEndpointEmbeddings(
                model="sentence-transformers/all-MiniLM-L6-v2"
            )

        if self.model is None:

            llm = HuggingFaceEndpoint(
                repo_id="meta-llama/Llama-3.1-8B-Instruct",
                task="text-generation",
            )

            self.model = ChatHuggingFace(llm=llm)

    def extract_video_id(self, url):

        if "youtu.be" in url:
            return url.split("/")[-1].split("?")[0]

        parsed = urlparse(url)

        return parse_qs(parsed.query)["v"][0]

    def format_docs(self, docs):

        return "\n\n".join(doc.page_content for doc in docs)

    def process_video(self, url):

        # Load models only when needed
        self.initialize_models()

        video_id = self.extract_video_id(url)

        transcript = YouTubeTranscriptApi().fetch(
            video_id,
            languages=["en"],
        )

        transcript = " ".join(
            chunk.text for chunk in transcript
        )

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
        )

        docs = splitter.create_documents([transcript])

        vector_store = FAISS.from_documents(
            docs,
            self.embeddings,
        )

        retriever = vector_store.as_retriever(
            search_kwargs={"k": 4}
        )

        prompt = PromptTemplate(
            template="""
You are an AI assistant.

Answer ONLY using the transcript.

If the answer is not present,
reply "I don't know."

Context:
{context}

Question:
{question}
""",
            input_variables=[
                "context",
                "question",
            ],
        )

        parallel = RunnableParallel(
            {
                "context": retriever
                | RunnableLambda(self.format_docs),
                "question": RunnablePassthrough(),
            }
        )

        parser = StrOutputParser()

        self.chain = (
            parallel
            | prompt
            | self.model
            | parser
        )

    def ask(self, question):

        if self.chain is None:
            raise Exception("Process a video first.")

        return self.chain.invoke(question)
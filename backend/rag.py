from urllib.parse import urlparse, parse_qs

from dotenv import load_dotenv
load_dotenv()


class YouTubeRAG:

    def __init__(self):
        self.retriever = None
        self.llm = None
        self.prompt = None

    def initialize(self):

        if self.llm is not None:
            return

        from langchain_huggingface import (
            HuggingFaceEndpoint,
            ChatHuggingFace,
            HuggingFaceEndpointEmbeddings,
        )

        from langchain_core.prompts import PromptTemplate

        self.embeddings = HuggingFaceEndpointEmbeddings(
            model="sentence-transformers/all-MiniLM-L6-v2"
        )

        endpoint = HuggingFaceEndpoint(
            repo_id="meta-llama/Llama-3.1-8B-Instruct",
            task="text-generation",
        )

        self.llm = ChatHuggingFace(llm=endpoint)

        self.prompt = PromptTemplate(
            template="""
You are a helpful assistant.

Answer ONLY from the transcript.

If the answer cannot be found,
reply "I don't know."

Context:
{context}

Question:
{question}
""",
            input_variables=["context", "question"],
        )

    def extract_video_id(self, url):

        if "youtu.be" in url:
            return url.split("/")[-1].split("?")[0]

        parsed = urlparse(url)
        return parse_qs(parsed.query)["v"][0]

    def process_video(self, url):

        self.initialize()

        from youtube_transcript_api import YouTubeTranscriptApi

        from langchain_text_splitters import (
            RecursiveCharacterTextSplitter,
        )

        from langchain_community.vectorstores import FAISS

        video_id = self.extract_video_id(url)

        transcript = YouTubeTranscriptApi().fetch(
            video_id,
            languages=["en"],
        )

        text = " ".join(chunk.text for chunk in transcript)

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
        )

        docs = splitter.create_documents([text])

        vectorstore = FAISS.from_documents(
            docs,
            self.embeddings,
        )

        self.retriever = vectorstore.as_retriever(
            search_kwargs={"k": 4}
        )

    def ask(self, question):

        if self.retriever is None:
            raise Exception("Process a video first.")

        docs = self.retriever.invoke(question)

        context = "\n\n".join(
            doc.page_content for doc in docs
        )

        prompt = self.prompt.format(
            context=context,
            question=question,
        )

        response = self.llm.invoke(prompt)

        return response.content
import axios from "axios";

const backendBaseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://youtube-ai-assistant-sjwk.onrender.com";

const api = axios.create({
    baseURL: backendBaseUrl,
});

export default api;
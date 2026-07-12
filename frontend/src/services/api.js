import axios from "axios";

const api = axios.create({
    baseURL: "https://youtube-ai-assistant-sjwk.onrender.com",
});

export default api;
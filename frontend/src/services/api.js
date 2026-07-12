import axios from "axios";

const api = axios.create({
    baseURL: "http://youtube-ai-assistant-sjwk.onrender.com",
});

export default api;
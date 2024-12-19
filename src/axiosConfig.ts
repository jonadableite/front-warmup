// axiosConfig.js
import axios from "axios";

const instance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "https://back.whatlead.com.br",
});

// Interceptor para adicionar o token de autenticação
instance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default instance;

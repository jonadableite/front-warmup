// axiosConfig.js
import axios from "axios";

const instance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor para adicionar o token de autenticação
instance.interceptors.request.use(
	(config: { headers: { Authorization: string } }) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	(error: any) => {
		return Promise.reject(error);
	},
);

export default instance;

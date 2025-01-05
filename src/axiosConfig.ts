// src/axiosConfig.ts
import axios from "axios";

const instance = axios.create({
	baseURL: "http://localhost:3050",
	headers: {
		"Content-Type": "application/json",
	},
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

// src/axiosConfig.ts
import axios from "axios";
import { API_BASE_URL } from "./config";

const instance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

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

instance.interceptors.response.use(
	(response) => response,
	(error) => {
		// Não redirecionar automaticamente para login em caso de erro 401
		if (
			error.response?.status === 401 &&
			!window.location.pathname.includes("/payment-success")
		) {
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	},
);

export default instance;

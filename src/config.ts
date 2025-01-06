// src/config.ts
export const API_BASE_URL = "https://aquecerapi.whatlead.com.br";

export const config = {
	stripe: {
		publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
	},
};

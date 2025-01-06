// src/types/env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
	// adicione outras variáveis de ambiente aqui se necessário
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

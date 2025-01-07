// src/types/stripe.ts

export interface Plan {
	name: string;
	price: {
		monthly: number;
		annual: number;
	};
	features: string[];
	icon: JSX.Element;
	bgGradient: string;
	recommended: boolean;
	priceId: {
		monthly: string;
		annual: string;
	};
}

export type PlanType = "free" | "basic" | "pro" | "enterprise";

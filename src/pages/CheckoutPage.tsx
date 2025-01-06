// src/pages/CheckoutPage.tsx
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import {
	ArrowLeft,
	CheckIcon,
	CreditCardIcon,
	ShieldCheckIcon,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckoutForm } from "../components/CheckoutForm";
import { stripePromise } from "../lib/stripe-client";

const CheckoutPage: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [price, setPrice] = useState<number | null>(null);
	const [billingCycle, setBillingCycle] = useState<string | null>(null);
	const [clientSecret, setClientSecret] = useState<string | null>(null);

	// Extrair informações do plano da navegação
	const {
		plan,
		priceId,
		price: planPrice,
		billingCycle: planBillingCycle,
	} = location.state as {
		plan: string;
		priceId: string;
		price: number;
		billingCycle: string;
	};

	useEffect(() => {
		setPrice(planPrice);
		setBillingCycle(planBillingCycle);
	}, [planPrice, planBillingCycle]);

	// Função para buscar o client secret
	const fetchClientSecret = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			console.log("Iniciando fetchClientSecret...");
			const token = localStorage.getItem("token");
			console.log("Token:", token);
			if (!token) {
				setError("Token não encontrado. Por favor, faça login novamente.");
				setLoading(false);
				return;
			}

			const apiUrl =
				import.meta.env.VITE_API_URL || "https://aquecerapi.whatlead.com.br";
			console.log("API URL:", apiUrl);

			const response = await fetch(
				`${apiUrl}/api/stripe/create-payment-intent`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						priceId,
						returnUrl: `${window.location.origin}/return`,
					}),
				},
			);

			console.log("Response status:", response.status);
			const data = await response.json();
			console.log("Response data:", data);

			if (response.status !== 200 || data.error) {
				console.error("Erro no server:", data.error || data);
				setError(data.error || "Erro desconhecido");
				return;
			}

			setClientSecret(data.clientSecret);
		} catch (err: any) {
			console.error("Erro na requisição:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [priceId]);

	useEffect(() => {
		fetchClientSecret();
	}, [fetchClientSecret]);

	// Detalhes do plano
	const getPlanDetails = () => {
		const planDetails = {
			basic: {
				color: "bg-blue-500",
				gradient: "from-blue-500 to-blue-700",
				features: [
					"2 Números",
					"Envio de Texto",
					"Suporte Básico",
					"Limite de 50 Mensagens/Dia",
				],
			},
			pro: {
				color: "bg-purple-500",
				gradient: "from-purple-500 to-purple-700",
				features: [
					"5 Números",
					"Envio de Texto e Áudio",
					"Suporte Prioritário",
					"Limite de 500 Mensagens/Dia",
					"Relatórios Avançados",
				],
			},
			enterprise: {
				color: "bg-green-500",
				gradient: "from-green-500 to-emerald-700",
				features: [
					"Números Ilimitados",
					"Envio de Texto, Áudio e Mídia",
					"Suporte Dedicado 24/7",
					"Mensagens Ilimitadas",
					"Relatórios Personalizados",
					"Integração API",
					"Segurança Avançada",
				],
			},
		};
		return planDetails[plan as keyof typeof planDetails] || planDetails.basic;
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-whatsapp-profundo via-whatsapp-profundo to-whatsapp-profundo p-4">
			<div className="max-w-7xl mx-auto">
				{/* Botão Voltar */}
				<motion.button
					onClick={() => navigate(-1)}
					className="flex items-center text-whatsapp-branco mb-8 hover:text-whatsapp-green transition-colors"
					whileHover={{ x: -5 }}
				>
					<ArrowLeft className="mr-2" />
					Voltar para planos
				</motion.button>

				{loading ? (
					<div className="flex justify-center items-center h-[70vh]">
						<motion.div
							animate={{ rotate: 360 }}
							transition={{
								repeat: Number.POSITIVE_INFINITY,
								duration: 1,
								ease: "linear",
							}}
						>
							<ShieldCheckIcon className="w-16 h-16 text-whatsapp-green animate-pulse" />
						</motion.div>
					</div>
				) : error ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="text-center p-8 bg-red-500/20 rounded-xl backdrop-blur-lg border border-red-500/30"
					>
						<h2 className="text-2xl font-bold mb-4 text-white">
							Erro no Checkout
						</h2>
						<p className="text-red-200">{error}</p>
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="grid lg:grid-cols-2 gap-8"
					>
						{/* Lado Esquerdo - Detalhes do Plano */}
						<div className="bg-whatsapp-cinza/20 backdrop-blur-lg rounded-3xl p-8 border border-whatsapp-green/30">
							<motion.div
								initial={{ y: -20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								className="space-y-6"
							>
								<div className="flex items-center space-x-4">
									<div className="p-3 bg-whatsapp-green/20 rounded-2xl">
										<CreditCardIcon className="w-8 h-8 text-whatsapp-green" />
									</div>
									<div>
										<h2 className="text-3xl font-bold text-whatsapp-branco capitalize">
											Plano {plan}
										</h2>
										<p className="text-whatsapp-cinzaClaro">
											{billingCycle === "monthly" ? "Mensal" : "Anual"}
										</p>
									</div>
								</div>

								<div className="space-y-4">
									{getPlanDetails().features.map((feature, index) => (
										<motion.div
											key={index}
											initial={{ x: -20, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											transition={{ delay: index * 0.1 }}
											className="flex items-center space-x-3 text-whatsapp-branco"
										>
											<div className="p-1 bg-whatsapp-green/20 rounded-full">
												<CheckIcon className="w-4 h-4 text-whatsapp-green" />
											</div>
											<span>{feature}</span>
										</motion.div>
									))}
								</div>

								<div className="pt-6 border-t border-whatsapp-green/20">
									<div className="flex items-center justify-between">
										<span className="text-whatsapp-cinzaClaro">Total:</span>
										<div className="text-right">
											<p className="text-3xl font-bold text-whatsapp-branco">
												R$ {price?.toFixed(2)}
											</p>
											<p className="text-sm text-whatsapp-cinzaClaro">
												por {billingCycle === "monthly" ? "mês" : "ano"}
											</p>
										</div>
									</div>
								</div>
							</motion.div>
						</div>

						{/* Lado Direito - Formulário de Checkout */}
						<div className="bg-whatsapp-cinza/20 backdrop-blur-lg rounded-3xl p-8 border border-whatsapp-green/30">
							{clientSecret && (
								<Elements
									stripe={stripePromise}
									options={{
										clientSecret,
										appearance: {
											theme: "night",
											variables: {
												colorPrimary: "#25D366",
												colorBackground: "#1F2937",
												colorText: "#FFFFFF",
												colorDanger: "#EF4444",
												fontFamily: "system-ui",
												spacingUnit: "4px",
												borderRadius: "8px",
											},
										},
									}}
								>
									<CheckoutForm
										clientSecret={clientSecret}
										plan={plan}
										price={price || 0}
									/>
								</Elements>
							)}
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default CheckoutPage;

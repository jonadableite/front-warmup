import { motion } from "framer-motion";
import { CheckIcon, CreditCardIcon, ShieldCheckIcon } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutPage: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [price, setPrice] = useState<number | null>(null);
	const [billingCycle, setBillingCycle] = useState<string | null>(null);

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
	const fetchCheckoutUrl = useCallback(async () => {
		setLoading(true); // Iniciar o loading
		setError(null); // Limpar erros anteriores
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				setError("Token não encontrado. Por favor, faça login novamente.");
				setLoading(false);
				return;
			}
			const response = await fetch(
				"https://aquecerapi.whatlead.com.br/users/create-checkout-session",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						priceId,
						returnUrl: `${window.location.origin}/return`, // Usar a origem da página
					}),
				},
			);

			if (response.status === 401) {
				setError("Token inválido. Por favor, faça login novamente.");
				setLoading(false);
				return;
			}

			const data = await response.json();

			if (data.error) {
				setError(data.error);
			} else {
				window.location.href = data.url;
			}
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false); // Finalizar o loading
		}
	}, [priceId, navigate]);

	useEffect(() => {
		fetchCheckoutUrl();
	}, [fetchCheckoutUrl]);

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

	// Renderização condicional de conteúdo
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{
						repeat: Number.POSITIVE_INFINITY,
						duration: 1,
						ease: "linear",
					}}
				>
					<ShieldCheckIcon className="w-16 h-16 text-white animate-pulse" />
				</motion.div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center p-8 bg-red-500/20 rounded-xl"
				>
					<h2 className="text-2xl font-bold mb-4">Erro no Checkout</h2>
					<p>{error}</p>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className="w-full max-w-6xl grid md:grid-cols-2 gap-8 bg-gray-800 rounded-2xl overflow-hidden shadow-2xl"
			>
				{/* Lado Esquerdo - Detalhes do Plano */}
				<div
					className={`p-8 ${
						getPlanDetails().gradient
					} flex flex-col justify-between`}
				>
					<div>
						<motion.h2
							initial={{ y: -20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							className="text-4xl font-bold mb-4 capitalize"
						>
							{plan} Plan
						</motion.h2>
						<p className="text-xl mb-6 opacity-80">
							A solução completa para sua empresa
						</p>

						<div className="space-y-4 mb-8">
							{getPlanDetails().features.map((feature, index) => (
								<motion.div
									key={index}
									initial={{ x: -20, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ delay: index * 0.1 }}
									className="flex items-center space-x-3"
								>
									<CheckIcon className="w-6 h-6" />
									<span>{feature}</span>
								</motion.div>
							))}
						</div>
					</div>

					<div className="flex items-center space-x-4">
						<CreditCardIcon className="w-12 h-12" />
						<div>
							<p className="font-bold text-2xl">R$ {price?.toFixed(2)}</p>
							<p>por {billingCycle === "monthly" ? "mês" : "ano"}</p>
						</div>
					</div>
				</div>

				{/* Lado Direito - Formulário de Checkout */}
				<div className="p-8 flex flex-col justify-center"></div>
			</motion.div>
		</div>
	);
};

export default CheckoutPage;

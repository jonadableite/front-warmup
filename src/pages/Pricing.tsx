import { motion } from "framer-motion";
import { CheckIcon, GlobeIcon, InfinityIcon, RocketIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PricingPage: React.FC = () => {
	const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
		"monthly",
	);
	const navigate = useNavigate();

	const plans = [
		{
			name: "basic",
			price: {
				monthly: 19.99,
				annual: 199.99,
			},
			features: [
				"2 Números",
				"Envio de Texto",
				"Suporte Básico",
				"Limite de 50 Mensagens/Dia",
			],
			icon: <RocketIcon className="w-12 h-12 text-blue-500" />,
			bgGradient: "from-blue-500 to-blue-700",
			recommended: false,
			priceId: {
				monthly: "price_1QXZeUP7kXKQS2swswgJXxmq", // priceId correto do plano básico mensal
				annual: "price_1QXldGP7kXKQS2swtG5ROJNP", // priceId correto do plano básico anual
			},
		},
		{
			name: "pro",
			price: {
				monthly: 49.99,
				annual: 499.99,
			},
			features: [
				"5 Números",
				"Envio de Texto e Áudio",
				"Suporte Prioritário",
				"Limite de 500 Mensagens/Dia",
				"Relatórios Avançados",
			],
			icon: <GlobeIcon className="w-12 h-12 text-purple-500" />,
			bgGradient: "from-purple-500 to-purple-700",
			recommended: true,
			priceId: {
				monthly: "price_1QXZgvP7kXKQS2swScbspD9T", // priceId correto do plano pro mensal
				annual: "price_1QXlclP7kXKQS2swYvpB2m6B", // priceId correto do plano pro anual
			},
		},
		{
			name: "enterprise",
			price: {
				monthly: 79.99,
				annual: 799.99,
			},
			features: [
				"Números Ilimitados",
				"Envio de Texto, Áudio e Mídia",
				"Suporte Dedicado 24/7",
				"Mensagens Ilimitadas",
				"Relatórios Personalizados",
				"Integração API",
				"Segurança Avançada",
			],
			icon: <InfinityIcon className="w-12 h-12 text-green-500" />,
			bgGradient: "from-green-500 to-emerald-700",
			recommended: false,
			priceId: {
				monthly: "price_1QXZiFP7kXKQS2sw2G8Io0Jx", // priceId correto do plano enterprise mensal
				annual: "price_1QXlc3P7kXKQS2swVckKe7KJ", // priceId correto do plano enterprise anual
			},
		},
	];

	const handleSubscribe = (
		planName: string,
		priceId: string,
		price: number,
	) => {
		// Lógica para assinatura do plano
		navigate("/checkout", {
			state: {
				plan: planName,
				priceId,
				price,
				billingCycle,
			},
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<motion.h1
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-whatsapp-green to-whatsapp-dark"
					>
						Escolha seu Plano
					</motion.h1>
					<p className="text-xl text-gray-300">
						Encontre o plano perfeito para suas necessidades
					</p>
				</div>

				<div className="flex justify-center mb-8">
					<div className="bg-gray-800 rounded-full p-1 flex items-center">
						<button
							onClick={() => setBillingCycle("monthly")}
							className={`px-4 py-2 rounded-full transition-colors ${
								billingCycle === "monthly"
									? "bg-gradient-to-r from-whatsapp-green to-whatsapp-dark text-white"
									: "text-gray-400"
							}`}
						>
							Mensal
						</button>
						<button
							onClick={() => setBillingCycle("annual")}
							className={`px-4 py-2 rounded-full transition-colors ${
								billingCycle === "annual"
									? "bg-gradient-to-r from-whatsapp-green to-whatsapp-dark text-white"
									: "text-gray-400"
							}`}
						>
							Anual
						</button>
					</div>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					{plans.map((plan) => (
						<motion.div
							key={plan.name}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							whileHover={{ scale: 1.05 }}
							className={`
                        bg-gray-800 rounded-2xl p-6
                        border border-opacity-20
                        ${
													plan.recommended
														? "border-green-500 border-opacity-100 transform scale-105 shadow-2xl"
														: "border-gray-700"
												}
                        transition-all duration-300
                        relative overflow-hidden
                    `}
						>
							{plan.recommended && (
								<div className="absolute top-0 right-0 bg-whatsapp-green text-white px-4 py-1 transform rotate-45 translate-x-1/4 -translate-y-1/4">
									Mais Popular
								</div>
							)}
							<div className="flex justify-between items-center mb-6">
								<div className="flex items-center space-x-4">
									{plan.icon}
									<h2 className="text-2xl font-bold capitalize">{plan.name}</h2>
								</div>
							</div>
							<div className="mb-6">
								<span className="text-4xl font-bold">
									R$ {plan.price[billingCycle]?.toFixed(2)}
								</span>
								<span className="text-gray-400 ml-2">
									/{billingCycle === "monthly" ? "mês" : "ano"}
								</span>
							</div>
							<ul className="space-y-3 mb-8">
								{plan.features.map((feature) => (
									<li key={feature} className="flex items-center space-x-2">
										<CheckIcon className="w-5 h-5 text-green-500" />
										<span>{feature}</span>
									</li>
								))}
							</ul>
							<motion.button
								onClick={() =>
									handleSubscribe(
										plan.name,
										plan.priceId[billingCycle],
										plan.price[billingCycle],
									)
								}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className={`
                            w-full py-3 rounded-full
                            bg-gradient-to-r ${plan.bgGradient}
                            text-white font-bold
                            hover:opacity-90
                            transition-all duration-300
                        `}
							>
								Escolher {plan.name}
							</motion.button>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};

export default PricingPage;

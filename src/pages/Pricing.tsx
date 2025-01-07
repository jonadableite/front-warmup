import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, GlobeIcon, InfinityIcon, RocketIcon } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { STRIPE_CONFIG } from "../../src/config/Stripe";
import type { Plan } from "../types/stripe";

// Novo componente para o texto com efeito de digitação
const TypewriterText: React.FC<{
	text: string;
	delay: number;
	onComplete?: () => void;
}> = ({ text, delay, onComplete }) => {
	const [displayText, setDisplayText] = useState("");
	const [isComplete, setIsComplete] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			let currentIndex = 0;
			const interval = setInterval(() => {
				if (currentIndex <= text.length) {
					setDisplayText(text.slice(0, currentIndex));
					currentIndex++;
				} else {
					setIsComplete(true);
					clearInterval(interval);
					onComplete?.();
				}
			}, 50);

			return () => clearInterval(interval);
		}, delay * 1000);

		return () => clearTimeout(timeout);
	}, [text, delay, onComplete]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`
				text-2xl md:text-3xl font-bold
				text-green-400
				transition-colors duration-300
				tracking-wider
				backdrop-blur-sm
				p-4 rounded-lg
				border border-gray-800
				shadow-lg
				transform
				hover:scale-105
				cursor-default
			`}
			style={{
				textShadow: "0 0 10px rgba(74, 222, 128, 0.5)",
				background: "rgba(0, 0, 0, 0.4)",
			}}
		>
			{displayText}
			<span className="animate-pulse">|</span>
		</motion.div>
	);
};

// Componente para o container das mensagens
const MessageContainer: React.FC<{ onComplete: () => void }> = ({
	onComplete,
}) => {
	const messages = [
		"Pronto para multiplicar seus resultados?",
		"Escolha o caminho da transformação",
		"🫵 Sua jornada para o sucesso começa aqui...",
	];

	const [isLastMessageComplete, setIsLastMessageComplete] = useState(false);

	useEffect(() => {
		if (isLastMessageComplete) {
			onComplete();
		}
	}, [isLastMessageComplete, onComplete]);

	return (
		<motion.div
			className="flex flex-col items-center justify-center space-y-6 max-w-4xl mx-auto"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
		>
			{messages.map((message, index) => (
				<TypewriterText
					key={index}
					text={message}
					delay={index * 2.5}
					onComplete={() => {
						if (index === messages.length - 1) {
							setIsLastMessageComplete(true);
						}
					}}
				/>
			))}
		</motion.div>
	);
};

const PricingPage: React.FC = () => {
	const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
		"monthly",
	);
	const [showPlans, setShowPlans] = useState(false);
	const [plansVisible, setPlansVisible] = useState(false);
	const navigate = useNavigate();

	const plans: Plan[] = [
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
				monthly: STRIPE_CONFIG.PRICES.BASIC.MONTHLY,
				annual: STRIPE_CONFIG.PRICES.BASIC.ANNUAL,
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
				monthly: STRIPE_CONFIG.PRICES.PRO.MONTHLY,
				annual: STRIPE_CONFIG.PRICES.PRO.ANNUAL,
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
				monthly: STRIPE_CONFIG.PRICES.ENTERPRISE.MONTHLY,
				annual: STRIPE_CONFIG.PRICES.ENTERPRISE.ANNUAL,
			},
		},
	];

	const isPriceValid = (priceId: string | undefined): boolean => {
		return Boolean(priceId && priceId.trim() !== "");
	};

	const handleSubscribe = (
		planName: string,
		priceId: string,
		price: number,
	) => {
		if (!isPriceValid(priceId)) {
			toast.error(
				`Configuração de preço indisponível para o plano ${planName}. Por favor, contate o suporte.`,
			);
			return;
		}

		navigate("/checkout", {
			state: {
				plan: planName,
				priceId,
				price,
				billingCycle,
			},
		});
	};

	useEffect(() => {
		const validatePriceIds = () => {
			const missingPrices = [];

			if (!isPriceValid(STRIPE_CONFIG.PRICES.BASIC.MONTHLY))
				missingPrices.push("BASIC_MONTHLY");
			if (!isPriceValid(STRIPE_CONFIG.PRICES.BASIC.ANNUAL))
				missingPrices.push("BASIC_ANNUAL");
			if (!isPriceValid(STRIPE_CONFIG.PRICES.PRO.MONTHLY))
				missingPrices.push("PRO_MONTHLY");
			if (!isPriceValid(STRIPE_CONFIG.PRICES.PRO.ANNUAL))
				missingPrices.push("PRO_ANNUAL");
			if (!isPriceValid(STRIPE_CONFIG.PRICES.ENTERPRISE.MONTHLY))
				missingPrices.push("ENTERPRISE_MONTHLY");
			if (!isPriceValid(STRIPE_CONFIG.PRICES.ENTERPRISE.ANNUAL))
				missingPrices.push("ENTERPRISE_ANNUAL");

			if (missingPrices.length > 0) {
				console.error("Configuração incompleta dos preços:", missingPrices);
				toast.error(
					"Alguns planos estão temporariamente indisponíveis. Por favor, tente novamente mais tarde.",
				);
			}
		};

		validatePriceIds();

		const timeout = setTimeout(() => {
			setShowPlans(true);
		}, 30000); // Mostra os planos após 30 segundos

		return () => clearTimeout(timeout);
	}, []);

	const handleMessagesComplete = () => {
		setShowPlans(true);
	};

	useEffect(() => {
		if (showPlans) {
			setPlansVisible(true);
		}
	}, [showPlans]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-whatsapp-profundo to-black text-white p-8">
			<ToastContainer />
			<div className="max-w-7xl mx-auto">
				<AnimatePresence>
					{!showPlans ? (
						<motion.div
							className="min-h-screen flex items-center justify-center relative"
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
						>
							<div className="absolute inset-0 bg-grid-pattern opacity-10" />
							<div className="relative z-10 w-full">
								<MessageContainer onComplete={handleMessagesComplete} />
							</div>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 1,
								delay: 0.3,
								ease: "easeOut",
							}}
						>
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
								<div className="bg-whatsapp-cinza rounded-full p-1 flex items-center">
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

							<motion.div
								className="grid md:grid-cols-3 gap-8"
								variants={{
									hidden: { opacity: 0 },
									show: {
										opacity: 1,
										transition: {
											staggerChildren: 0.2,
										},
									},
								}}
								initial="hidden"
								animate="show"
							>
								{plans.map((plan) => (
									<motion.div
										key={plan.name}
										variants={{
											hidden: { opacity: 0, y: 50 },
											show: {
												opacity: 1,
												y: 0,
												transition: {
													duration: 0.5,
													ease: "easeOut",
												},
											},
										}}
										className={`
											bg-whatsapp-cinza rounded-2xl p-6
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
												<h2 className="text-2xl font-bold capitalize">
													{plan.name}
												</h2>
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
												<li
													key={feature}
													className="flex items-center space-x-2"
												>
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
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default PricingPage;

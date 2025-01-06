// src/pages/PaymentSuccess.tsx
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [status, setStatus] = useState("loading");
	const [subscription, setSubscription] = useState(null);

	useEffect(() => {
		const checkSubscription = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await fetch(
					"https://aquecerapi.whatlead.com.br/api/stripe/subscription/status",
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					},
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				console.log("Subscription data:", data);

				if (data.status === "active" || data.plan !== "free") {
					setStatus("success");
					setSubscription(data);
				} else {
					// Aguardar um pouco e tentar novamente
					await new Promise((resolve) => setTimeout(resolve, 2000));
					await checkSubscription();
				}
			} catch (error) {
				console.error("Erro ao verificar assinatura:", error);
				setStatus("error");
			}
		};

		checkSubscription();
	}, []);

	useEffect(() => {
		if (status === "success") {
			navigate("/");
		}
	}, [status, navigate]);

	useEffect(() => {
		const checkSubscription = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await fetch(
					"https://aquecerapi.whatlead.com.br/api/stripe/subscription/status",
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					},
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				console.log("Subscription data:", data);

				if (data.status === "active" || data.plan !== "free") {
					setStatus("success");
					setSubscription(data);
				} else {
					// Aguardar um pouco e tentar novamente
					await new Promise((resolve) => setTimeout(resolve, 2000));
					await checkSubscription();
				}
			} catch (error) {
				console.error("Erro ao verificar assinatura:", error);
				setStatus("error");
			}
		};

		// Verificar se há um payment_intent ou session_id nos parâmetros
		const paymentIntent = searchParams.get("payment_intent");
		const sessionId = searchParams.get("session_id");

		if (paymentIntent || sessionId) {
			checkSubscription();
		} else {
			setStatus("error");
		}
	}, [searchParams]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-whatsapp-profundo via-whatsapp-profundo to-whatsapp-profundo p-4">
			<div className="max-w-2xl mx-auto">
				{status === "loading" ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center p-8 bg-whatsapp-cinza/20 rounded-xl backdrop-blur-lg"
					>
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-whatsapp-green mx-auto"></div>
						<p className="text-whatsapp-branco mt-4">
							Verificando status do pagamento...
						</p>
					</motion.div>
				) : status === "success" ? (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-whatsapp-cinza/20 backdrop-blur-lg rounded-3xl p-8 border border-whatsapp-green/30"
					>
						<div className="text-center">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								className="inline-block p-3 bg-whatsapp-green/20 rounded-full mb-6"
							>
								<CheckCircle className="w-16 h-16 text-whatsapp-green" />
							</motion.div>

							<h1 className="text-3xl font-bold text-whatsapp-branco mb-4">
								Pagamento Realizado com Sucesso!
							</h1>

							<p className="text-whatsapp-cinzaClaro mb-8">
								Seu plano foi ativado e você já pode começar a usar todos os
								recursos.
							</p>

							<motion.button
								onClick={() => navigate("/")}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="inline-flex items-center px-6 py-3 bg-whatsapp-green text-white rounded-xl font-medium"
							>
								Ir para o Dashboard
								<ArrowRight className="ml-2 w-5 h-5" />
							</motion.button>
						</div>
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center p-8 bg-red-500/20 rounded-xl backdrop-blur-lg border border-red-500/30"
					>
						<h2 className="text-2xl font-bold text-white mb-4">
							Erro na Verificação
						</h2>
						<p className="text-red-200 mb-6">
							Não foi possível verificar o status do seu pagamento.
						</p>
						<button
							onClick={() => navigate("/pricing")}
							className="bg-white text-red-500 px-6 py-2 rounded-lg"
						>
							Voltar para Planos
						</button>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default PaymentSuccess;

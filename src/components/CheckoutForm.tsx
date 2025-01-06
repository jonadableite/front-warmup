// src/components/CheckoutForm.tsx
import {
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { LockIcon } from "lucide-react";
import { useState } from "react";

export const CheckoutForm = ({ clientSecret, plan, price }) => {
	const stripe = useStripe();
	const elements = useElements();
	const [message, setMessage] = useState(null);
	const [isProcessing, setIsProcessing] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!stripe || !elements) return;

		setIsProcessing(true);

		const protocol = window.location.protocol;
		const host = window.location.host;

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${protocol}//${host}/payment-success`,
			},
		});

		if (error) {
			setMessage(error.message);
		}

		setIsProcessing(false);
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-6"
		>
			<div className="text-center mb-8">
				<h3 className="text-2xl font-bold text-whatsapp-branco mb-2">
					Informações de Pagamento
				</h3>
				<p className="text-whatsapp-cinzaClaro">
					Complete suas informações de pagamento de forma segura
				</p>
			</div>

			<motion.form onSubmit={handleSubmit} className="space-y-8">
				<div className="bg-whatsapp-profundo/50 rounded-xl p-6 backdrop-blur-lg border border-whatsapp-green/20">
					<PaymentElement />
				</div>

				<div className="space-y-4">
					<motion.button
						type="submit"
						disabled={isProcessing}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className={`
                            w-full py-4 px-6 rounded-xl
                            bg-gradient-to-r from-whatsapp-green to-whatsapp-dark
                            text-white font-medium text-lg
                            disabled:opacity-50
                            transition-all duration-300
                            flex items-center justify-center
                            shadow-lg shadow-whatsapp-green/20
                        `}
					>
						<LockIcon className="w-5 h-5 mr-2" />
						{isProcessing ? "Processando..." : `Pagar R$ ${price.toFixed(2)}`}
					</motion.button>

					<p className="text-center text-whatsapp-cinzaClaro text-sm">
						Pagamento seguro processado pelo Stripe
					</p>
				</div>

				{message && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-red-500/20 text-red-200 p-4 rounded-xl text-sm text-center backdrop-blur-lg border border-red-500/30"
					>
						{message}
					</motion.div>
				)}
			</motion.form>
		</motion.div>
	);
};

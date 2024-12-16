import axios from "axios";
import { motion } from "framer-motion";
import { Key, Lock, Mail, ShieldCheck } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const ForgotPassword: React.FC = () => {
	const [email, setEmail] = useState("");
	const [step, setStep] = useState<"email" | "verify" | "reset">("email");
	const [verificationCode, setVerificationCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const navigate = useNavigate();

	const handleSendCode = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${API_BASE_URL}/auth/forgot-password`,
				{ email },
			);
			if (response.data.success) {
				toast.success(response.data.message);
				setStep("verify");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Erro ao enviar código");
		}
	};

	const handleVerifyCode = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${API_BASE_URL}/auth/verify-reset-code`,
				{
					email,
					code: verificationCode,
				},
			);
			if (response.data.success) {
				toast.success(response.data.message);
				setStep("reset");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Código inválido");
		}
	};

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			toast.error("Senhas não coincidem");
			return;
		}

		try {
			const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
				email,
				newPassword,
				code: verificationCode,
			});
			if (response.data.success) {
				toast.success(response.data.message);
				navigate("/login");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Erro ao redefinir senha");
		}
	};

	const renderStep = () => {
		switch (step) {
			case "email":
				return (
					<motion.form
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						onSubmit={handleSendCode}
						className="space-y-6"
					>
						<div className="flex items-center space-x-4 bg-gray-800 p-3 rounded-xl">
							<Mail className="text-blue-500" />
							<input
								type="email"
								placeholder="Insira seu email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="bg-transparent w-full text-white focus:outline-none"
							/>
						</div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="submit"
							className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-xl text-white font-bold"
						>
							Enviar Código de Recuperação
						</motion.button>
					</motion.form>
				);
			case "verify":
				return (
					<motion.form
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						onSubmit={handleVerifyCode}
						className="space-y-6"
					>
						<div className="flex items-center space-x-4 bg-gray-800 p-3 rounded-xl">
							<ShieldCheck className="text-green-500" />
							<input
								type="text"
								placeholder="Código de Verificação"
								value={verificationCode}
								onChange={(e) => setVerificationCode(e.target.value)}
								required
								className="bg-transparent w-full text-white focus:outline-none"
							/>
						</div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="submit"
							className="w-full bg-gradient-to-r from-green-600 to-emerald-600 py-3 rounded-xl text-white font-bold"
						>
							Verificar Código
						</motion.button>
					</motion.form>
				);
			case "reset":
				return (
					<motion.form
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						onSubmit={handleResetPassword}
						className="space-y-6"
					>
						<div className="flex items-center space-x-4 bg-gray-800 p-3 rounded-xl">
							<Lock className="text-red-500" />
							<input
								type="password"
								placeholder="Nova Senha"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
								className="bg-transparent w-full text-white focus:outline-none"
							/>
						</div>
						<div className="flex items-center space-x-4 bg-gray-800 p-3 rounded-xl">
							<Key className="text-red-500" />
							<input
								type="password"
								placeholder="Confirmar Nova Senha"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								className="bg-transparent w-full text-white focus:outline-none"
							/>
						</div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="submit"
							className="w-full bg-gradient-to-r from-red-600 to-pink-600 py-3 rounded-xl text-white font-bold"
						>
							Redefinir Senha
						</motion.button>
					</motion.form>
				);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				className="w-full max-w-md bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700"
			>
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
						Recuperação de Senha
					</h1>
					<p className="text-gray-400 mt-2">
						{step === "email" && "Insira seu email para recuperação"}
						{step === "verify" && "Verifique o código enviado"}
						{step === "reset" && "Crie uma nova senha"}
					</p>
				</div>
				{renderStep()}
			</motion.div>
		</div>
	);
};

export default ForgotPassword;

import axios from "axios";
import { motion } from "framer-motion";
import { Key, Lock, Mail, ShieldCheck } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import MatrixRain from "../components/MatrixRain";
import { API_BASE_URL } from "../config";

const ForgotPassword: React.FC = () => {
	const [email, setEmail] = useState("");
	const [step, setStep] = useState<"email" | "verify" | "reset">("email");
	const [verificationCode, setVerificationCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSendCode = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await axios.post(`${API_BASE_URL}/api/password/forgot`, {
				email,
			});
			if (response.data.success) {
				toast.success(response.data.message);
				setStep("verify");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Erro ao enviar código");
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyCode = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await axios.post(`${API_BASE_URL}/api/password/verify`, {
				email,
				code: verificationCode,
			});
			if (response.data.success) {
				toast.success(response.data.message);
				setStep("reset");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Código inválido");
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			toast.error("Senhas não coincidem");
			return;
		}

		setLoading(true);
		try {
			const response = await axios.post(`${API_BASE_URL}/api/password/reset`, {
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
		} finally {
			setLoading(false);
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
						<div className="relative">
							<label
								htmlFor="email"
								className="block text-sm font-medium text-whatsapp-branco mb-2"
							>
								Email
							</label>
							<motion.input
								whileFocus={{ scale: 1.02, borderColor: "#00FF6A" }}
								type="email"
								id="email"
								placeholder="Digite seu email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="w-full px-4 py-3 bg-whatsapp-prata/30 border border-whatsapp-prata/50 rounded-xl text-whatsapp-branco focus:outline-none focus:ring-2 focus:ring-whatsapp-dark transition duration-300"
							/>
							<Mail className="absolute right-3 top-1/2 transform -translate-y-1/4 text-whatsapp-branco/70" />
						</div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="submit"
							className="w-full py-3 bg-gradient-to-r from-whatsapp-green/30 to-whatsapp-green text-white rounded-xl hover:from-whatsapp-green/80 hover:to-whatsapp-green transition duration-300 transform hover:scale-105"
							disabled={loading}
						>
							{loading ? "Enviando..." : "Enviar Código de Recuperação"}
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
						<div className="relative">
							<label
								htmlFor="verificationCode"
								className="block text-sm font-medium text-whatsapp-branco mb-2"
							>
								Código de Verificação
							</label>
							<motion.input
								whileFocus={{ scale: 1.02, borderColor: "#00FF6A" }}
								type="text"
								id="verificationCode"
								placeholder="Digite o código"
								value={verificationCode}
								onChange={(e) => setVerificationCode(e.target.value)}
								required
								className="w-full px-4 py-3 bg-whatsapp-prata/30 border border-whatsapp-prata/50 rounded-xl text-whatsapp-branco focus:outline-none focus:ring-2 focus:ring-whatsapp-dark transition duration-300"
							/>
							<ShieldCheck className="absolute right-3 top-1/2 transform -translate-y-1/4 text-whatsapp-branco/70" />
						</div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="submit"
							className="w-full py-3 bg-gradient-to-r from-whatsapp-green/30 to-whatsapp-green text-white rounded-xl hover:from-whatsapp-green/80 hover:to-whatsapp-green transition duration-300 transform hover:scale-105"
							disabled={loading}
						>
							{loading ? "Verificando..." : "Verificar Código"}
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
						<div className="relative">
							<label
								htmlFor="newPassword"
								className="block text-sm font-medium text-whatsapp-branco mb-2"
							>
								Nova Senha
							</label>
							<motion.input
								whileFocus={{ scale: 1.02, borderColor: "#00FF6A" }}
								type="password"
								id="newPassword"
								placeholder="Nova Senha"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
								className="w-full px-4 py-3 bg-whatsapp-prata/30 border border-whatsapp-prata/50 rounded-xl text-whatsapp-branco focus:outline-none focus:ring-2 focus:ring-whatsapp-dark transition duration-300"
							/>
							<Lock className="absolute right-3 top-1/2 transform -translate-y-1/4 text-whatsapp-branco/70" />
						</div>
						<div className="relative">
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-whatsapp-branco mb-2"
							>
								Confirmar Nova Senha
							</label>
							<motion.input
								whileFocus={{ scale: 1.02, borderColor: "#00FF6A" }}
								type="password"
								id="confirmPassword"
								placeholder="Confirmar Nova Senha"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								className="w-full px-4 py-3 bg-whatsapp-prata/30 border border-whatsapp-prata/50 rounded-xl text-whatsapp-branco focus:outline-none focus:ring-2 focus:ring-whatsapp-dark transition duration-300"
							/>
							<Key className="absolute right-3 top-1/2 transform -translate-y-1/4 text-whatsapp-branco/70" />
						</div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="submit"
							className="w-full py-3 bg-gradient-to-r from-whatsapp-green/30 to-whatsapp-green text-white rounded-xl hover:from-whatsapp-green/80 hover:to-whatsapp-green transition duration-300 transform hover:scale-105"
							disabled={loading}
						>
							{loading ? "Redefinindo..." : "Redefinir Senha"}
						</motion.button>
					</motion.form>
				);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-whatsapp-profundo via-black to-whatsapp-green/5 flex items-center justify-center px-4 py-8 overflow-hidden">
			<MatrixRain />
			<div className="absolute inset-0 bg-gradient-to-r from-whatsapp-green/5 to-whatsapp-profundo/20 blur-3xl animate-pulse"></div>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="relative z-10 w-full max-w-md bg-whatsapp-profundo/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-whatsapp-prata/30 p-8"
			>
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-whatsapp-green">WhatLead</h1>
					<p className="text-whatsapp-branco/70 mt-2">
						{step === "email" && "Insira seu email para recuperação"}
						{step === "verify" && "Verifique o código enviado"}
						{step === "reset" && "Crie uma nova senha"}
					</p>
				</div>
				{renderStep()}
				<div className="mt-6 text-center">
					<Link
						to="/login"
						className="text-whatsapp-green hover:text-whatsapp-dark"
					>
						Voltar para o login
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default ForgotPassword;

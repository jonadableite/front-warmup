import { motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../axiosConfig";
import { API_BASE_URL } from "../config";

const Login: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const response = await axios.post(`${API_BASE_URL}/api/session`, {
				email,
				password,
			});

			const { token, user } = response.data;
			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));

			toast.success("Login realizado com sucesso!");
			navigate("/");
		} catch (err: any) {
			if (err.response) {
				setError(err.response.data.error || "Erro ao fazer login");
				toast.error(err.response.data.error || "Erro ao fazer login");
			} else {
				setError("Erro desconhecido");
				toast.error("Erro desconhecido");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-whatsapp-profundo via-black to-whatsapp-green/5 flex items-center justify-center px-4 py-8 overflow-hidden">
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
						Faça login na sua conta de Warmup
					</p>
				</div>

				{error && (
					<motion.p
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-red-500 text-center mb-4"
					>
						{error}
					</motion.p>
				)}

				<form onSubmit={handleLogin} className="space-y-6">
					<div>
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
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-3 bg-whatsapp-prata/30 border border-whatsapp-prata/50 rounded-xl text-whatsapp-branco focus:outline-none focus:ring-2 focus:ring-whatsapp-dark transition duration-300"
							placeholder="Digite seu email"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-whatsapp-branco mb-2"
						>
							Senha
						</label>
						<div className="relative">
							<motion.input
								whileFocus={{ scale: 1.02, borderColor: "#0fa94f" }}
								type={showPassword ? "text" : "password"}
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-3 bg-whatsapp-prata/30 border border-whatsapp-prata/50 rounded-xl text-whatsapp-branco focus:outline-none focus:ring-2 focus:ring-whatsapp-dark transition duration-300"
								placeholder="Digite sua senha"
								required
							/>
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-whatsapp-branco/70 hover:text-whatsapp-branco"
							>
								{showPassword ? "👁️" : "👁️‍🗨️"}
							</motion.button>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								type="checkbox"
								id="remember"
								className="h-4 w-4 text-whatsapp-green focus:ring-whatsapp-dark border-whatsapp-prata rounded"
							/>
							<label
								htmlFor="remember"
								className="ml-2 block text-sm text-whatsapp-branco"
							>
								Lembrar de mim
							</label>
						</div>
						<div>
							<Link
								to="/forgot-password"
								className="text-sm text-whatsapp-green hover:text-whatsapp-dark"
							>
								Esqueceu a senha?
							</Link>
						</div>
					</div>

					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						type="submit"
						className="w-full py-3 bg-gradient-to-r from-whatsapp-green/30 to-whatsapp-green text-white rounded-xl hover:from-whatsapp-green/80 hover:to-whatsapp-green transition duration-300 transform hover:scale-105"
						disabled={loading}
					>
						{loading ? "Carregando..." : "Entrar"}
					</motion.button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-whatsapp-branco/70">
						Não tem uma conta?
						<Link
							to="/register"
							className="ml-2 text-whatsapp-green hover:text-whatsapp-dark"
						>
							Registre-se
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default Login;

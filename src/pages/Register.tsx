import { motion } from "framer-motion";
import { AtSignIcon, LockIcon, UserIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

const Register: React.FC = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!name || !email || !password || !confirmPassword) {
			setError("Por favor, preencha todos os campos.");
			return;
		}

		if (password !== confirmPassword) {
			setError("As senhas não coincidem.");
			return;
		}

		try {
			const response = await axios.post("/users", {
				name,
				email,
				password,
			});

			if (response.status === 201) {
				setSuccess("Usuário registrado com sucesso! Redirecionando...");
				setTimeout(() => {
					navigate("/login");
				}, 2000);
			}
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.error || "Erro ao registrar usuário.");
			} else {
				setError("Erro ao registrar usuário.");
			}
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-whatsapp-profundo via-black to-whatsapp-green flex items-center justify-center px-4 py-8 overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-r from-whatsapp-green/20 to-whatsapp-profundo/20 blur-3xl animate-pulse"></div>

			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, type: "spring" }}
				className="relative z-10 w-full max-w-md bg-whatsapp-profundo/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-whatsapp-prata/30 p-8"
			>
				<div className="text-center mb-8">
					<img src="/Logo.png" alt="Logo" className="mx-auto h-16 w-auto" />
					<p className="text-gray-400">Crie sua conta e comece sua jornada</p>
				</div>

				{error && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-6 text-center"
					>
						{error}
					</motion.div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<UserIcon className="text-gray-500" size={20} />
						</div>
						<input
							type="text"
							placeholder="Nome completo"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus: ring-whatsapp-dark transition duration-300"
						/>
					</div>

					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<AtSignIcon className="text-gray-500" size={20} />
						</div>
						<input
							type="email"
							placeholder="Seu melhor email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus: ring-whatsapp-dark transition duration-300"
						/>
					</div>

					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<LockIcon className="text-gray-500" size={20} />
						</div>
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Senha"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus: ring-whatsapp-dark transition duration-300"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
						>
							{showPassword ? "👁️" : "👁️‍🗨️"}
						</button>
					</div>

					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<LockIcon className="text-gray-500" size={20} />
						</div>
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Confirmar Senha"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus: ring-whatsapp-dark transition duration-300"
						/>
					</div>

					<button
						type="submit"
						className="w-full py-3 bg-gradient-to-r from-whatsapp-green/30 to-whatsapp-green text-white rounded-xl hover:from-whatsapp-dark hover:to-whatsapp-profundo transition duration-300 transform hover:scale-105"
					>
						Criar Conta
					</button>

					<div className="text-center mt-6">
						<p className="text-gray-400">
							Já tem uma conta?{" "}
							<Link
								to="/login"
								className="text-whatsapp-green hover:text-whatsapp-dark font-bold"
							>
								Faça login
							</Link>
						</p>
					</div>
				</form>
			</motion.div>

			{/* Efeitos de fundo animados */}
			<div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-purple-900/30 to-transparent pointer-events-none"></div>
		</div>
	);
};

export default Register;

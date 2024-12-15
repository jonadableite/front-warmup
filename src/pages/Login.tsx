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
			const response = await axios.post(`${API_BASE_URL}/sessions`, {
				email,
				password,
			});

			console.log("Response Data:", response.data);

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
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-900 flex items-center justify-center px-4 py-8">
			<div className="w-full max-w-md bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-8">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
						WhatLead
					</h1>
					<p className="text-gray-400 mt-2">
						Faça login na sua conta de Warmup
					</p>
				</div>

				{error && <p className="text-red-500 text-center mb-4">{error}</p>}

				<form onSubmit={handleLogin} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-300 mb-2"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
							placeholder="Digite seu email"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-300 mb-2"
						>
							Senha
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
								placeholder="Digite sua senha"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
							>
								{showPassword ? "👁️" : "👁️‍🗨️"}
							</button>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								type="checkbox"
								id="remember"
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label
								htmlFor="remember"
								className="ml-2 block text-sm text-gray-300"
							>
								Lembrar de mim
							</label>
						</div>
						<div>
							<Link
								to="/forgot-password"
								className="text-sm text-blue-500 hover:text-blue-400"
							>
								Esqueceu a senha?
							</Link>
						</div>
					</div>

					<button
						type="submit"
						className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-300 transform"
						disabled={loading}
					>
						{loading ? "Carregando..." : "Entrar"}
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-gray-400">
						Não tem uma conta?
						<Link
							to="/register"
							className="ml-2 text-blue-500 hover:text-blue-400"
						>
							Registre-se
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;

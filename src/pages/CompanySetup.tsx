// src/pages/CompanySetup.tsx
import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axiosConfig";
import MatrixRain from "../components/MatrixRain";
import { API_BASE_URL } from "../config";

const CompanySetup: React.FC = () => {
	const [companyName, setCompanyName] = useState("");
	const [step, setStep] = useState(0);
	const navigate = useNavigate();

	// Efeito para verificar o status da empresa
	useEffect(() => {
		const checkCompanyStatus = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(
					`${API_BASE_URL}/api/users/company/status`,
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				);

				if (!response.data.isTemporaryCompany) {
					navigate("/");
				}
			} catch (error) {
				console.error("Erro ao verificar status da empresa:", error);
				toast.error("Erro ao verificar status da empresa");
				navigate("/login");
			}
		};

		checkCompanyStatus();
	}, [navigate]);

	// Efeito para transição automática após a mensagem de boas-vindas
	useEffect(() => {
		if (step === 0) {
			const timer = setTimeout(() => {
				setStep(1);
			}, 5000); // 5 segundos para a mensagem de boas-vindas

			return () => clearTimeout(timer);
		}
	}, [step]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!companyName.trim()) {
			toast.error("Por favor, digite o nome da sua empresa");
			return;
		}

		try {
			const token = localStorage.getItem("token");

			console.log("Token:", token); // Log para debug

			const response = await axios.put(
				`${API_BASE_URL}/api/users/company/update`,
				{ name: companyName },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response.status === 200) {
				toast.success("Empresa configurada com sucesso!");
				navigate("/");
			}
		} catch (error: any) {
			console.error("Erro ao atualizar empresa:", error);
			const errorMessage =
				error.response?.data?.error ||
				"Erro ao configurar empresa. Tente novamente.";
			toast.error(errorMessage);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-whatsapp-profundo via-black to-whatsapp-green/5 flex items-center justify-center px-4 py-8 overflow-hidden">
			<MatrixRain />
			<div className="absolute inset-0 bg-gradient-to-r from-whatsapp-green/5 to-whatsapp-profundo/20 blur-3xl animate-pulse" />

			<AnimatePresence mode="wait">
				{step === 0 && (
					<motion.div
						key="welcome"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						transition={{ duration: 0.8 }}
						className="text-center text-white"
					>
						<h1 className="text-6xl font-bold mb-4 text-whatsapp-green">
							Bem-vindo ao WhatLead
						</h1>
						<p className="text-2xl text-whatsapp-branco/70">
							Prepare-se para uma experiência incrível
						</p>
					</motion.div>
				)}

				{step === 1 && (
					<motion.div
						key="setup"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
						className="relative z-10 w-full max-w-md bg-whatsapp-profundo/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-whatsapp-prata/30 p-8"
					>
						<h2 className="text-3xl font-bold text-whatsapp-green mb-6 text-center">
							Configure sua empresa
						</h2>
						<p className="text-whatsapp-branco/70 text-center mb-8">
							Para começar, dê um nome à sua empresa
						</p>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label
									htmlFor="companyName"
									className="block text-sm font-medium text-whatsapp-branco mb-2"
								>
									Nome da sua empresa
								</label>
								<motion.input
									whileFocus={{ scale: 1.02 }}
									type="text"
									id="companyName"
									value={companyName}
									onChange={(e) => setCompanyName(e.target.value)}
									className="w-full px-4 py-3 bg-whatsapp-prata/30 border border-whatsapp-prata/50 rounded-xl text-whatsapp-branco focus:outline-none focus:ring-2 focus:ring-whatsapp-green transition duration-300"
									placeholder="Digite o nome da sua empresa"
									required
									autoFocus
								/>
							</div>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								type="submit"
								className="w-full py-3 bg-gradient-to-r from-whatsapp-green/30 to-whatsapp-green text-white rounded-xl hover:from-whatsapp-green/80 hover:to-whatsapp-green transition duration-300"
							>
								Começar minha jornada
							</motion.button>
						</form>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default CompanySetup;

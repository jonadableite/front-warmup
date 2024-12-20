import { useSidebar } from "@/components/ui/sidebar";
import { useDarkMode } from "@/hooks/useDarkMode";
import { motion } from "framer-motion";
import { RocketIcon } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
	const [isDarkMode, setIsDarkMode] = useDarkMode();
	const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);
	const [trialHoursLeft, setTrialHoursLeft] = useState<number | null>(null);
	const navigate = useNavigate();
	const { open } = useSidebar();

	const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

	useEffect(() => {
		const fetchTrialInfo = () => {
			try {
				const userString = localStorage.getItem("user");
				if (userString) {
					const user = JSON.parse(userString);
					if (user && user.trialEndDate) {
						const trialEndDate = new Date(user.trialEndDate);
						const today = new Date();
						const diffInTime = trialEndDate.getTime() - today.getTime();
						const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
						const diffInHours = Math.floor(
							(diffInTime % (1000 * 3600 * 24)) / (1000 * 3600),
						);

						setTrialDaysLeft(diffInDays);
						setTrialHoursLeft(diffInHours);
					} else {
						setTrialDaysLeft(0);
						setTrialHoursLeft(0);
					}
				} else {
					setTrialDaysLeft(null);
					setTrialHoursLeft(null);
				}
			} catch (error) {
				console.error("Erro ao buscar informações do período de teste:", error);
				setTrialDaysLeft(null);
				setTrialHoursLeft(null);
			}
		};

		fetchTrialInfo();
		const intervalId = setInterval(fetchTrialInfo, 60000); // Atualiza a cada minuto

		return () => clearInterval(intervalId);
	}, []);

	const handleUpgrade = () => {
		navigate("/pricing");
	};

	const renderTrialInfo = () => {
		if (trialDaysLeft === null) return null;

		if (trialDaysLeft > 0 || (trialDaysLeft === 0 && trialHoursLeft > 0)) {
			return (
				<div className="flex items-center space-x-2">
					<div className="text-xs text-gray-600 dark:text-gray-300">
						Período de teste
					</div>
					<div className="bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full text-xs font-semibold text-purple-600 dark:text-purple-400">
						{trialDaysLeft} dia{trialDaysLeft !== 1 ? "s" : ""}
						{trialHoursLeft &&
							trialHoursLeft > 0 &&
							` e ${trialHoursLeft} hora${trialHoursLeft !== 1 ? "s" : ""}`}
					</div>
				</div>
			);
		}

		return (
			<motion.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={handleUpgrade}
				className="relative inline-flex items-center justify-center overflow-hidden
                    text-xs font-bold text-white
                    bg-gradient-to-r from-whatsapp-dark via-whatsapp-green to-whatsapp-dark
                    bg-size-200 bg-pos-0 hover:bg-pos-100
                    py-1 px-3 rounded-full
                    transition-all duration-300 ease-in-out
                    transform hover:rotate-3 hover:shadow-lg
                    group"
			>
				<RocketIcon className="mr-1 w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
				Upgrade
				<span
					className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 rounded-full animate-pulse"
				/>
			</motion.button>
		);
	};

	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5, type: "spring" }}
			className={`fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 shadow-md flex justify-between items-center px-6 z-10`}
		>
			{/* <div className="flex items-center space-x-4">{renderTrialInfo()}</div>
			<div className="flex items-center">
				<label className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
					<input
						type="checkbox"
						checked={isDarkMode}
						onChange={toggleDarkMode}
						className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
					/>
					<span className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer">
						<img
							src={MoonIcon}
							alt="Modo Escuro"
							className="absolute left-0 top-0 w-6 h-6"
						/>
					</span>
				</label>
				<style>{`
                        .toggle-checkbox:checked {
                            right: 0;
                            border-color: #4caf50;
                        }
                        .toggle-checkbox:checked + .toggle-label {
                            background-color: #4caf50;
                        }
                    `}</style>
			</div> */}
		</motion.header>
	);
};

export default Header;

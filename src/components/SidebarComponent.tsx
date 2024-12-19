import LogoWhatsapp from "@/assets/logo-whatsapp.svg";
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import {
	CalendarIcon,
	ChevronUp,
	CreditCard,
	FlameIcon,
	HomeIcon,
	LifeBuoy,
	PhoneIcon,
	RocketIcon,
	User2,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SidebarComponent: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const userString = localStorage.getItem("user");
	const user = userString ? JSON.parse(userString) : null;
	const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);

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
						setTrialDaysLeft(diffInDays);
					} else {
						setTrialDaysLeft(0);
					}
				} else {
					setTrialDaysLeft(null);
				}
			} catch (error) {
				console.error("Erro ao buscar informações do período de teste:", error);
				setTrialDaysLeft(null);
			}
		};

		fetchTrialInfo();
	}, []);

	const sidebarItems = [
		{ id: 1, icon: HomeIcon, label: "Início", path: "/" },
		{ id: 2, icon: FlameIcon, label: "Aquecimento", path: "/aquecimento" },
		{ id: 3, icon: PhoneIcon, label: "Números", path: "/numeros" },
	];

	const handleUpgrade = () => {
		navigate("/pricing");
	};

	return (
		<motion.div
			initial={false}
			animate={{
				width: "240px",
				transition: { duration: 0.3, ease: "easeInOut" },
			}}
			className="h-screen bg-gray-900/95 backdrop-blur-md border-r border-gray-800/50 shadow-xl z-50 overflow-y-auto fixed top-0 left-0"
		>
			<div className="flex flex-col h-full">
				{/* Header */}
				<motion.div
					className="p-4 border-b border-gray-800/50"
					initial={false}
					animate={{ justifyContent: "flex-start" }}
				>
					<div className="flex items-center space-x-3">
						<img src={LogoWhatsapp} className="w-10 h-10" alt="Logo" />
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="flex flex-col"
						>
							<span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
								Warmer
							</span>
							<span className="text-xs text-gray-400">by Whatlead</span>
						</motion.div>
					</div>
				</motion.div>

				{/* Navigation */}
				<div className="flex-1 py-4 px-3">
					<nav className="space-y-1">
						{sidebarItems.map((item) => {
							const isActive = location.pathname === item.path;
							return (
								<Link key={item.id} to={item.path}>
									<motion.div
										whileHover={{ scale: 1.02, x: 5 }}
										whileTap={{ scale: 0.98 }}
										className={`
                      flex items-center p-3 rounded-lg
                      ${
												isActive
													? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400"
													: "text-gray-400 hover:text-white hover:bg-white/5"
											}
                      transition-colors duration-200
                    `}
									>
										<item.icon size={20} />
										<motion.span
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: -10 }}
											className="ml-3 text-sm font-medium"
										>
											{item.label}
										</motion.span>
										{isActive && (
											<motion.div
												layoutId="activeTab"
												className="absolute left-0 w-1 h-8 bg-green-400 rounded-r-full"
											/>
										)}
									</motion.div>
								</Link>
							);
						})}
					</nav>
				</div>

				{/* Upgrade Section */}
				<div className="p-4 border-t border-gray-800/50">
					<div className="mb-4 flex flex-col items-center">
						<h4 className="text-sm font-semibold text-gray-400">
							Upgrade do Plano
						</h4>
						<motion.p
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							className="text-xs text-gray-500 mt-1 text-center"
						>
							Desbloqueie todos os recursos e tenha acesso ilimitado à nossa
							plataforma
						</motion.p>
					</div>
					<div className="flex justify-center">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleUpgrade}
							className="relative inline-flex items-center justify-center overflow-hidden
              text-sm font-bold text-white
              bg-gradient-to-r from-whatsapp-dark via-green-500 to-whatsapp-dark
              bg-size-200 bg-pos-0 hover:bg-pos-100
              px-4 py-2 rounded-full
              transition-all duration-300 ease-in-out
              transform hover:rotate-3 hover:shadow-lg
              group"
						>
							<RocketIcon className="mr-2 w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
							Upgrade
							<motion.span
								initial={{ width: 0 }}
								animate={{ width: "100%" }}
								transition={{
									duration: 2,
									repeat: Number.POSITIVE_INFINITY,
									repeatType: "reverse",
									ease: "easeInOut",
								}}
								className="absolute bottom-0 left-0 h-1 bg-white/30 group-hover:bg-white/50"
							/>
							<motion.div
								initial={{ opacity: 0 }}
								whileHover={{ opacity: 1 }}
								className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100
              transition-opacity duration-300 rounded-full
              animate-pulse"
							/>
						</motion.button>
					</div>
				</div>

				{/* Footer */}
				<div className="p-4 border-t border-gray-800/50">
					<DropdownMenuTrigger asChild>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="flex items-center w-full p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
						>
							<User2 size={20} />
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="ml-3 flex-1 text-left text-sm font-medium"
							>
								{user?.name}
							</motion.div>
							<motion.div
								animate={{ rotate: false ? 180 : 0 }}
								transition={{ duration: 0.2 }}
								className="ml-auto"
							>
								<ChevronUp size={16} />
							</motion.div>
						</motion.button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						side="top"
						align="start"
						className="w-56 bg-gray-900 border border-gray-800 text-gray-300"
					>
						<DropdownMenuItem onClick={() => {}}>
							<User2 className="mr-2" size={16} />
							<span>Informações da Conta</span>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => navigate("/pricing")}>
							<CreditCard className="mr-2" size={16} />
							<span>Gerenciar Plano</span>
						</DropdownMenuItem>
						{trialDaysLeft !== null && (
							<DropdownMenuItem>
								<CalendarIcon className="mr-2" size={16} />
								<span>
									{trialDaysLeft > 0
										? `${trialDaysLeft} dias restantes`
										: "Período de teste expirado"}
								</span>
							</DropdownMenuItem>
						)}
						<DropdownMenuItem
							onClick={() =>
								window.open("mailto:suporte@whatlead.com.br", "_blank")
							}
						>
							<LifeBuoy className="mr-2" size={16} />
							<span>Requisito de Suporte</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								localStorage.removeItem("token");
								navigate("/login");
							}}
						>
							<span>Sair</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</div>
			</div>
		</motion.div>
	);
};

export default SidebarComponent;

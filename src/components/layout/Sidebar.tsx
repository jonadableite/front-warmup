import LogoutIcon from "@/assets/icon-logout.svg"; // Importe o ícone de logout
import LogoWhatsapp from "@/assets/logo-whatsapp.svg";
import {
	ChevronsLeftIcon,
	ChevronsRightIcon,
	FlameIcon,
	HomeIcon,
	PhoneIcon,
	SettingsIcon,
} from "lucide-react";
import type React from "react";
import { Link, useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
	isOpen: boolean;
	toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
	const navigate = useNavigate();

	const handleLogout = () => {
		// Remover o token de autenticação
		localStorage.removeItem("token");
		// Redirecionar para a página de login
		navigate("/login");
	};

	const sidebarItems = [
		{ id: 1, icon: HomeIcon, label: "Início", path: "/" },
		{ id: 2, icon: FlameIcon, label: "Aquecimento", path: "/aquecimento" },
		{ id: 3, icon: PhoneIcon, label: "Números", path: "/numeros" },
		{
			id: 5,
			icon: SettingsIcon,
			label: "Configurações",
			path: "/configuracoes",
		},
	];

	return (
		<div
			className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-md transition-all duration-300 z-20 ${
				isOpen ? "w-64" : "w-20"
			}`}
		>
			<button
				type="button"
				onClick={toggleSidebar}
				className="absolute top-4 right-[-12px] bg-whatsapp-green text-white p-1 rounded-full hover:bg-whatsapp-dark transition z-30"
			>
				{isOpen ? (
					<ChevronsLeftIcon size={20} />
				) : (
					<ChevronsRightIcon size={20} />
				)}
			</button>

			<div
				className={`sticky top-0 bg-whatsapp-green text-white p-4 flex items-center ${
					isOpen ? "justify-between" : "justify-center"
				}`}
			>
				{isOpen && (
					<div className="flex items-center">
						<img
							src={LogoWhatsapp}
							alt="WhatsApp Warmer"
							className="w-10 h-10 mr-3"
						/>
						<h2 className="text-xl font-bold">Warmer</h2>
						<span>WhatLead</span>
					</div>
				)}
				{!isOpen && (
					<img src={LogoWhatsapp} alt="WhatsApp Warmer" className="w-10 h-10" />
				)}
			</div>

			<div className="overflow-y-auto py-4">
				{sidebarItems.map((item) => (
					<Link to={item.path} key={item.id} className="block">
						<SidebarItem icon={item.icon} label={item.label} isOpen={isOpen} />
					</Link>
				))}
				<button onClick={handleLogout} className="block w-full text-left">
					<SidebarItem
						icon={() => (
							<img src={LogoutIcon} alt="Logout" className="w-6 h-6" />
						)}
						label="Sair"
						isOpen={isOpen}
					/>
				</button>
			</div>
		</div>
	);
};

export default Sidebar;

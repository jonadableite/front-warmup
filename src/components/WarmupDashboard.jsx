
// src/components/WarmupDashboard.jsx
import {
	ActivityIcon,
	ClockIcon,
	MessageCircleIcon,
	TrendingUpIcon,
} from "lucide-react";
import React, { useState } from "react";

// Componente de Cartão de Estatística
const StatCard = ({ icon: Icon, title, value, trend, color }) => (
	<div
		className={`
    bg-gradient-to-br ${color}
    text-white
    rounded-2xl
    p-6
    transform transition-all
    duration-300
    hover:scale-105
    hover:shadow-2xl
    shadow-lg
  `}
	>
		<div className="flex justify-between items-center">
			<div>
				<Icon className="w-10 h-10 mb-4 opacity-75" />
				<h3 className="text-sm font-medium opacity-80">{title}</h3>
				<p className="text-3xl font-bold">{value}</p>
			</div>
			{trend && (
				<div className="flex items-center text-sm">
					<span
						className={`
            ${trend.direction === "up" ? "text-green-300" : "text-red-300"}
            flex items-center
          `}
					>
						{trend.direction === "up" ? "▲" : "▼"}
						{trend.percentage}%
					</span>
				</div>
			)}
		</div>
	</div>
);

// Componente de Gráfico de Progresso
const ProgressBar = ({ label, value, color }) => (
	<div className="mb-4">
		<div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
			<span>{label}</span>
			<span>{value}%</span>
		</div>
		<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
			<div
				className={`${color} h-2.5 rounded-full`}
				style={{ width: `${value}%` }}
			></div>
		</div>
	</div>
);

const WarmupDashboard = () => {
	const [dashboardData, setDashboardData] = useState({
		stats: [
			{
				icon: TrendingUpIcon,
				title: "Total Warmups",
				value: 256,
				trend: { direction: "up", percentage: 12.5 },
				color: "from-blue-500 to-blue-700",
			},
			{
				icon: ActivityIcon,
				title: "Instâncias Ativas",
				value: 24,
				trend: { direction: "up", percentage: 8.2 },
				color: "from-green-500 to-green-700",
			},
			{
				icon: MessageCircleIcon,
				title: "Mensagens Enviadas",
				value: "15,342",
				trend: { direction: "down", percentage: 3.5 },
				color: "from-purple-500 to-purple-700",
			},
			{
				icon: ClockIcon,
				title: "Tempo Médio",
				value: "4h 32m",
				trend: { direction: "up", percentage: 5.7 },
				color: "from-pink-500 to-pink-700",
			},
		],
		instanceProgress: [
			{ label: "Instância 5512988444921", value: 75, color: "bg-blue-600" },
			{ label: "Instância 5512992465180", value: 45, color: "bg-green-600" },
			{ label: "Instância 5599887766", value: 90, color: "bg-purple-600" },
		],
		messageTypes: [
			{ label: "Conversas", value: 40, color: "bg-blue-500" },
			{ label: "Imagens", value: 25, color: "bg-green-500" },
			{ label: "Áudios", value: 20, color: "bg-purple-500" },
			{ label: "Vídeos", value: 15, color: "bg-pink-500" },
		],
	});

	return (
		<div
			className="
      bg-gray-50 dark:bg-gray-900
      min-h-screen
      p-8
      space-y-8
    "
		>
			<div
				className="
        bg-white
        dark:bg-gray-800
        shadow-2xl
        rounded-3xl
        p-8
        border
        border-gray-200
        dark:border-gray-700
      "
			>
				<h1
					className="
          text-4xl
          font-extrabold
          mb-8
          text-transparent
          bg-clip-text
          bg-gradient-to-r
          from-blue-600
          to-purple-600
          dark:from-blue-400
          dark:to-purple-400
        "
				>
					WhatsApp Warmer Dashboard
				</h1>

				{/* Grid de Estatísticas */}
				<div className="grid md:grid-cols-4 gap-6">
					{dashboardData.stats.map((stat, index) => (
						<StatCard key={index} {...stat} />
					))}
				</div>
			</div>

			{/* Seção de Detalhes */}
			<div className="grid md:grid-cols-2 gap-8">
				{/* Progresso de Instâncias */}
				<div
					className="
          bg-white
          dark:bg-gray-800
          rounded-3xl
          p-6
          shadow-xl
          border
          border-gray-200
          dark:border-gray-700
        "
				>
					<h2
						className="
            text-2xl
            font-bold
            mb-6
            text-gray-800
            dark:text-gray-200
          "
					>
						Progresso das Instâncias
					</h2>
					{dashboardData.instanceProgress.map((progress, index) => (
						<ProgressBar key={index} {...progress} />
					))}
				</div>

				{/* Tipos de Mensagens */}
				<div
					className="
          bg-white
          dark:bg-gray-800
          rounded-3xl
          p-6
          shadow-xl
          border
          border-gray-200
          dark:border-gray-700
        "
				>
					<h2
						className="
            text-2xl
            font-bold
            mb-6
            text-gray-800
            dark:text-gray-200
          "
					>
						Distribuição de Mensagens
					</h2>
					{dashboardData.messageTypes.map((type, index) => (
						<ProgressBar key={index} {...type} />
					))}
				</div>
			</div>
		</div>
	);
};

export default WarmupDashboard;

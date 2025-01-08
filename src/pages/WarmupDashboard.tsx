import {
	ActivityIcon,
	ClockIcon,
	MessageCircleIcon,
	TrendingUpIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE_URL = "https://aquecerapi.whatlead.com.br";

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
				value: 0,
				trend: { direction: "up", percentage: 0 },
				color: "from-blue-500 to-blue-700",
			},
			{
				icon: ActivityIcon,
				title: "Instâncias Ativas",
				value: 0,
				trend: { direction: "up", percentage: 0 },
				color: "from-green-500 to-green-700",
			},
			{
				icon: MessageCircleIcon,
				title: "Mensagens Enviadas",
				value: "0",
				trend: { direction: "down", percentage: 0 },
				color: "from-purple-500 to-purple-700",
			},
			{
				icon: ClockIcon,
				title: "Tempo Médio",
				value: "0m",
				trend: { direction: "up", percentage: 0 },
				color: "from-pink-500 to-pink-700",
			},
		],
		instanceProgress: [],
		messageTypes: [],
	});

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/api/dashboard`);
				const data = await response.json();

				setDashboardData({
					stats: [
						{
							...dashboardData.stats[0],
							value: data.totalWarmups || 0,
							trend: {
								direction: data.warmupTrend > 0 ? "up" : "down",
								percentage: Math.abs(data.warmupTrend || 0),
							},
						},
						{
							...dashboardData.stats[1],
							value: data.activeInstances || 0,
							trend: {
								direction: data.instanceTrend > 0 ? "up" : "down",
								percentage: Math.abs(data.instanceTrend || 0),
							},
						},
						{
							...dashboardData.stats[2],
							value: data.totalMessages || "0",
							trend: {
								direction: data.messageTrend > 0 ? "up" : "down",
								percentage: Math.abs(data.messageTrend || 0),
							},
						},
						{
							...dashboardData.stats[3],
							value: data.averageTime || "0m",
							trend: {
								direction: data.timeTrend > 0 ? "up" : "down",
								percentage: Math.abs(data.timeTrend || 0),
							},
						},
					],
					instanceProgress: data.instanceProgress || [],
					messageTypes: data.messageTypes || [],
				});
			} catch (error) {
				console.error("Erro ao buscar dados do dashboard:", error);
			}
		};

		fetchDashboardData();
		const intervalId = setInterval(fetchDashboardData, 30000); // Atualiza a cada 30 segundos

		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className="w-full dark:bg-gray-900">
			<div className="w-full dark:bg-gray-800">
				<h1 className="text-4xl font-extrabold p-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
					WhatsApp Warmer Dashboard
				</h1>

				<div className="grid md:grid-cols-4 gap-6 p-6">
					{dashboardData.stats.map((stat, index) => (
						<StatCard key={index} {...stat} />
					))}
				</div>
			</div>

			<div className="grid md:grid-cols-2 gap-8 p-6">
				<div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl">
					<h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
						Progresso das Instâncias
					</h2>
					{dashboardData.instanceProgress.map((progress, index) => (
						<ProgressBar
							key={index}
							label={progress.label}
							value={progress.value}
							color={progress.color}
						/>
					))}
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl">
					<h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
						Distribuição de Mensagens
					</h2>
					{dashboardData.messageTypes.map((type, index) => (
						<ProgressBar
							key={index}
							label={type.label}
							value={type.value}
							color={type.color}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default WarmupDashboard;

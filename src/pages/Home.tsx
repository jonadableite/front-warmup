import { motion } from "framer-motion";
import {
	ActivityIcon,
	ClockIcon,
	EyeIcon,
	MessageCircleIcon,
	TrendingUpIcon,
} from "lucide-react";
import type React from "react";
import { useLayoutEffect, useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	PolarAngleAxis,
	PolarGrid,
	Radar,
	RadarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import axios from "../axiosConfig";

// Interface para tipagem dos dados
interface WarmupStats {
	_id: string;
	instanceId: string;
	messagesSent: number;
	messagesReceived: number;
	mediaStats: {
		text: number;
		image: number;
		video: number;
		audio: number;
		sticker: number;
		reaction: number;
	};
	warmupTime: number;
	status: "active" | "paused";
	lastActive: string;
	startTime: string;
	pauseTime: string;
	progress: number;
	mediaReceived: {
		text: number;
		image: number;
		audio: number;
		sticker: number;
		reaction: number;
	};
}

// Componente StatCard
const StatCard = ({ icon: Icon, title, value, trend, color }) => (
	<motion.div
		whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,0,0,0.2)" }}
		className={`relative overflow-hidden bg-gradient-to-br ${color} text-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-2xl`}
	>
		<div className="flex justify-between items-center">
			<div>
				<div className="mb-4 bg-white/20 rounded-full p-3 inline-block">
					<Icon className="w-8 h-8 text-white opacity-80" />
				</div>
				<h3 className="text-sm font-medium text-white mb-2">{title}</h3>
				<p className="text-3xl font-bold text-white">{value}</p>
			</div>
			{trend && (
				<div
					className={`flex items-center text-sm ${
						trend.direction === "up" ? "text-green-300" : "text-red-300"
					} bg-white/20 px-3 py-1 rounded-full`}
				>
					{trend.direction === "up" ? "▲" : "▼"}
					{trend.percentage}%
				</div>
			)}
		</div>
	</motion.div>
);

// Componente ProgressBar
const ProgressBar = ({ label, value, color }) => (
	<div className="mb-6">
		<div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
			<span className="font-medium">{label}</span>
			<span className="font-bold">{value.toFixed(2)}%</span>
		</div>
		<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
			<motion.div
				initial={{ width: 0 }}
				animate={{ width: `${value}%` }}
				transition={{ duration: 0.8, type: "spring" }}
				className={`${color} h-full rounded-full`}
			/>
		</div>
	</div>
);

const Home: React.FC = () => {
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
				value: "0h",
				trend: { direction: "up", percentage: 0 },
				color: "from-pink-500 to-pink-700",
			},
		],
		instanceProgress: [],
		messageTypes: [],
		instanceDetails: [],
	});

	const [selectedInstanceDetails, setSelectedInstanceDetails] =
		useState<WarmupStats | null>(null);

	useLayoutEffect(() => {
		const fetchDashboardData = async () => {
			try {
				// Busca os dados do dashboard a partir da rota do backend
				const response = await axios.get("/dashboard");
				const {
					totalWarmups,
					activeInstances,
					totalMessages,
					averageTime,
					instanceProgress,
					messageTypes,
					instances, // Adicionando a busca das instâncias
				} = response.data;

				setDashboardData((prevState) => ({
					...prevState,
					stats: [
						{ ...prevState.stats[0], value: totalWarmups },
						{ ...prevState.stats[1], value: activeInstances },
						{ ...prevState.stats[2], value: totalMessages },
						{ ...prevState.stats[3], value: `${averageTime}h` },
					],
					instanceProgress,
					messageTypes,
					instanceDetails: instances, // Armazenando os detalhes das instâncias
				}));
				console.log("Dados do Dashboard:", instances);
			} catch (error) {
				console.error("Erro ao buscar dados do dashboard:", error);
			}
		};

		fetchDashboardData();
		const intervalId = setInterval(fetchDashboardData, 30000);

		return () => clearInterval(intervalId);
	}, []);

	const generateAreaChartData = (instance: WarmupStats) => {
		return [
			{ name: "Dia 1", mensagens: instance.messagesSent / 10 },
			{ name: "Dia 2", mensagens: instance.messagesSent / 8 },
			{ name: "Dia 3", mensagens: instance.messagesSent / 6 },
			{ name: "Dia 4", mensagens: instance.messagesSent / 4 },
			{ name: "Dia 5", mensagens: instance.messagesSent / 2 },
		];
	};

	return (
		<div className="min-h-screen bg-whatsapp-light dark:bg-gray-900 p-6">
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="container mx-auto"
			>
				<header className="mb-10">
					<h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-center">
						WhatsApp Warmer Dashboard
					</h1>
				</header>

				<div className="grid md:grid-cols-4 gap-6 mb-10">
					{dashboardData.stats.map((stat, index) => (
						<StatCard key={index} {...stat} />
					))}
				</div>

				<div className="grid md:grid-cols-2 gap-8">
					<motion.div
						className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl"
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						<h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
							Progresso das Instâncias
						</h2>
						{Array.isArray(dashboardData.instanceDetails) &&
							dashboardData.instanceDetails.map((instance, index) => {
								const progressValue =
									typeof instance.warmupTime === "number" &&
									instance.warmupTime > 0
										? Math.min((instance.warmupTime / (480 * 3600)) * 100, 100)
										: 0;
								return (
									<div key={index} className="flex items-center mb-4">
										<div className="flex-grow mr-4">
											<ProgressBar
												label={instance.instanceId}
												value={progressValue}
												color={
													progressValue >= 100 ? "bg-green-500" : "bg-blue-500"
												}
											/>
										</div>
										<button
											className="text-blue-500 hover:text-blue-700"
											onClick={() => {
												if (
													dashboardData.instanceDetails &&
													dashboardData.instanceDetails[index]
												) {
													setSelectedInstanceDetails(
														dashboardData.instanceDetails[index],
													);
												}
											}}
										>
											<EyeIcon className="w-6 h-6" />
										</button>
									</div>
								);
							})}
					</motion.div>

					<motion.div
						className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl"
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						<h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
							Distribuição de Mensagens
						</h2>
						<ResponsiveContainer width="100%" height={350}>
							<RadarChart
								cx="50%"
								cy="50%"
								outerRadius="80%"
								data={dashboardData.messageTypes}
							>
								<PolarGrid
									stroke="rgba(0,0,0,0.1)"
									strokeDasharray="3 3"
									className="dark:stroke-white"
								/>
								<PolarAngleAxis
									dataKey="label"
									tick={{
										fill: "rgb(18, 140, 126)",
										fontSize: 12,
										fontWeight: 600,
										className: "dark:fill-white",
									}}
								/>
								<Radar
									name="Mensagens"
									dataKey="value"
									stroke="#25D366"
									fill="#25D366"
									fillOpacity={0.6}
									className="dark:stroke-[#936bff] dark:fill-[#936bff]"
								/>
								<Tooltip
									cursor={{
										stroke: "rgba(255,255,255,0.2)",
										className: "dark:stroke-white",
									}}
									contentStyle={{
										backgroundColor: "rgba(0,0,0,0.8)",
										borderRadius: "12px",
										color: "black",
										border: "none",
										className: "dark:bg-gray-800 dark:text-white",
									}}
									labelStyle={{
										color: "rgba(248, 248, 248, 0.7)",
										className: "dark:fill-white",
									}}
								/>
							</RadarChart>
						</ResponsiveContainer>
					</motion.div>
				</div>

				{selectedInstanceDetails && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
							<h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
								Detalhes da Instância: {selectedInstanceDetails.instanceId}
							</h3>

							<div className="grid md:grid-cols-3 gap-6">
								{/* Coluna de Informações Básicas */}
								<div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
									<h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
										Informações Básicas
									</h4>
									<div className="space-y-3">
										<p className="flex justify-between">
											<span className="font-medium">Status:</span>
											<span
												className={`
                                                ${
																									selectedInstanceDetails.status ===
																									"active"
																										? "text-green-600"
																										: "text-red-600"
																								} font-bold
                                            `}
											>
												{selectedInstanceDetails.status.toUpperCase()}
											</span>
										</p>
										<p className="flex justify-between">
											<span>Mensagens Enviadas:</span>
											<span className="font-bold">
												{selectedInstanceDetails.messagesSent}
											</span>
										</p>
										<p className="flex justify-between">
											<span>Mensagens Recebidas:</span>
											<span className="font-bold">
												{selectedInstanceDetails.messagesReceived}
											</span>
										</p>
										<p className="flex justify-between">
											<span>Tempo de Aquecimento:</span>
											<span className="font-bold">
												{selectedInstanceDetails.warmupTime} min
											</span>
										</p>
									</div>
								</div>

								{/* Coluna de Estatísticas de Mídia */}
								<div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
									<h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
										Estatísticas de Mídia
									</h4>
									<div className="space-y-3">
										{Object.entries(selectedInstanceDetails.mediaStats).map(
											([type, count]) => (
												<div
													key={type}
													className="flex justify-between items-center"
												>
													<span className="capitalize">{type}:</span>
													<span className="font-bold">{count}</span>
												</div>
											),
										)}
									</div>
								</div>

								{/* Coluna de Gráfico de Progressão */}
								<div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
									<h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
										Progresso de Aquecimento
									</h4>
									<ResponsiveContainer width="100%" height={250}>
										<AreaChart
											data={generateAreaChartData(selectedInstanceDetails)}
										>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="name" />
											<YAxis />
											<Tooltip />
											<Area
												type="monotone"
												dataKey="mensagens"
												stroke="#8884d8"
												fill="url(#colorUv)"
												fillOpacity={0.3}
											/>
											<defs>
												<linearGradient
													id="colorUv"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="5%"
														stopColor="#8884d8"
														stopOpacity={0.8}
													/>
													<stop
														offset="95%"
														stopColor="#8884d8"
														stopOpacity={0}
													/>
												</linearGradient>
											</defs>
										</AreaChart>
									</ResponsiveContainer>
								</div>
							</div>

							{/* Gráfico Completo de Progressão */}
							<div className="mt-8 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
								<h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
									Progressão Detalhada
								</h4>
								<ResponsiveContainer width="100%" height={300}>
									<AreaChart
										data={generateAreaChartData(selectedInstanceDetails)}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Area
											type="monotone"
											dataKey="mensagens"
											stroke="#8884d8"
											fill="url(#colorUv)"
											fillOpacity={0.6}
										/>
									</AreaChart>
								</ResponsiveContainer>
							</div>

							<button
								className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
								onClick={() => setSelectedInstanceDetails(null)}
							>
								Fechar
							</button>
						</div>
					</div>
				)}
			</motion.div>
		</div>
	);
};

export default Home;

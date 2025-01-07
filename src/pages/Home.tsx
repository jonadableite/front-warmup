import { motion } from "framer-motion";
import { ActivityIcon, ClockIcon, EyeIcon, TrendingUpIcon } from "lucide-react";
import type React from "react";
import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { getToken, isAuthenticated } from "../utils/auth";

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
	receivedStats: {
		text: number;
		image: number;
		video: number;
		audio: number;
		sticker: number;
		reaction: number;
		totalAllTime: number;
	} | null;
	warmupTime: number;
	status: "active" | "paused";
	lastActive: string;
	startTime: string;
	pauseTime: string;
	progress: number;
}

// Componente StatCard
const StatCard = ({ icon: Icon, title, value, trend, color, description }) => (
	<motion.div
		whileHover={{ scale: 1.02 }}
		className={`relative overflow-hidden bg-gradient-to-br ${color} rounded-2xl p-6 shadow-lg`}
	>
		<div className="absolute top-0 right-0 mt-4 mr-4">
			<Icon className="w-8 h-8 text-white/30" />
		</div>
		<div className="relative z-10">
			<h3 className="text-sm font-medium text-white/80 mb-1">{title}</h3>
			<p className="text-3xl font-bold text-white mb-2">{value}</p>
			<p className="text-sm text-white/70">{description}</p>
			{trend && (
				<div className="mt-4 flex items-center gap-2">
					<div
						className={`flex items-center text-sm ${
							trend.direction === "up" ? "text-green-200" : "text-red-200"
						} bg-white/10 px-2 py-1 rounded-full`}
					>
						{trend.direction === "up" ? "↑" : "↓"}
						<span className="ml-1">{trend.percentage}%</span>
					</div>
					<span className="text-xs text-white/60">vs. último período</span>
				</div>
			)}
		</div>
		<div className="absolute bottom-0 right-0 transform translate-y-1/3 translate-x-1/3">
			<div className="w-24 h-24 bg-white/10 rounded-full" />
		</div>
	</motion.div>
);

// Componente ProgressBar
const ProgressBar = ({ label, value, color }) => (
	<div className="mb-6">
		<div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
			<span className="font-medium text-gray-300">{label}</span>
			<span className="font-bold">{value.toFixed(2)}%</span>
		</div>
		<div className="w-full bg-gray-200 dark:bg-whatsapp-profundo rounded-full h-3 overflow-hidden">
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
	const navigate = useNavigate();

	useLayoutEffect(() => {
		const checkAuthAndFetchData = async () => {
			if (!isAuthenticated()) {
				navigate("/login");
				return;
			}

			const token = getToken();
			console.log("Token atual:", token); // Para debug

			try {
				const response = await axios.get("/api/dashboard");
				console.log("Dashboard response:", response.data);
				// Processar dados do dashboard...
			} catch (error) {
				console.error("Erro ao buscar dados do dashboard:", error);
				if (axios.isAxiosError(error) && error.response?.status === 401) {
					navigate("/login");
				}
			}
		};

		checkAuthAndFetchData();
		const intervalId = setInterval(checkAuthAndFetchData, 30000);

		return () => clearInterval(intervalId);
	}, [navigate]);

	const [dashboardData, setDashboardData] = useState({
		stats: [
			{
				icon: TrendingUpIcon,
				title: "Total Warmups",
				value: 0,
				trend: { direction: "up", percentage: 0 },
				color: "from-emerald-400 to-teal-600",
				description: "Total de aquecimentos iniciados",
			},
			{
				icon: ActivityIcon,
				title: "Instâncias Ativas",
				value: 0,
				trend: { direction: "up", percentage: 0 },
				color: "from-blue-400 to-indigo-600",
				description: "Instâncias em aquecimento",
			},
			{
				icon: ClockIcon,
				title: "Tempo Médio",
				value: "0h",
				trend: { direction: "up", percentage: 0 },
				color: "from-violet-400 to-purple-600",
				description: "Média de tempo de aquecimento",
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
				const response = await axios.get("/api/dashboard");
				const {
					totalWarmups,
					activeInstances,
					averageTime,
					instanceProgress,
					messageTypes,
					instances,
					previousPeriod,
				} = response.data;

				// Calcular tendências
				const calculateTrend = (current: number, previous: number) => {
					if (previous === 0) return { direction: "up", percentage: 100 };
					const percentage = ((current - previous) / previous) * 100;
					return {
						direction: percentage >= 0 ? "up" : "down",
						percentage: Math.abs(Math.round(percentage)),
					};
				};

				setDashboardData((prevState) => ({
					...prevState,
					stats: [
						{
							...prevState.stats[0],
							value: totalWarmups,
							trend: calculateTrend(
								totalWarmups,
								previousPeriod?.totalWarmups || 0,
							),
						},
						{
							...prevState.stats[1],
							value: activeInstances,
							trend: calculateTrend(
								activeInstances,
								previousPeriod?.activeInstances || 0,
							),
						},
						{
							...prevState.stats[2],
							value: `${averageTime}h`,
							trend: calculateTrend(
								Number.parseFloat(averageTime),
								previousPeriod?.averageTime || 0,
							),
						},
					],
					instanceProgress,
					messageTypes,
					instanceDetails: instances,
				}));
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
		<div className="min-h-screen bg-gradient-to-br from-whatsapp-profundo via-whatsapp-profundo to-whatsapp-profundo p-6">
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="container mx-auto"
			>
				<header className="mb-10">
					<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-whatsapp-green to-whatsapp-light">
						WhatsApp Warmer Dashboard
					</h1>
				</header>

				<div className="grid md:grid-cols-3 gap-6 mb-10">
					{dashboardData.stats.map((stat, index) => (
						<StatCard key={index} {...stat} />
					))}
				</div>

				<div className="grid md:grid-cols-2 gap-8">
					<motion.div
						className="bg-white dark:bg-whatsapp-cinza rounded-3xl p-6 shadow-xl"
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
						className="bg-white dark:bg-whatsapp-cinza rounded-3xl p-6 shadow-xl"
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
										className: "dark:bg-whatsapp-profundo dark:text-white",
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
						<div className="bg-white dark:bg-whatsapp-profundo rounded-lg p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
							<h3 className="text-2xl font-bold mb-6 text-whatsapp-profundo dark:text-gray-200">
								Detalhes da Instância: {selectedInstanceDetails.instanceId}
							</h3>

							<div className="grid md:grid-cols-3 gap-6">
								{/* Coluna de Informações Básicas */}
								<div className="bg-gray-100 dark:bg-whatsapp-profundo rounded-lg p-4 shadow-md">
									<h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
										Informações Básicas
									</h4>
									<div className="space-y-3">
										<p className="flex justify-between">
											<span className="font-medium text-gray-300">Status:</span>
											<span
												className={`font-bold ${selectedInstanceDetails.status === "active" ? "text-green-600" : "text-red-600"}`}
											>
												{selectedInstanceDetails.status.toUpperCase()}
											</span>
										</p>
										<p className="flex justify-between">
											<span className="text-gray-300">Mensagens Enviadas:</span>{" "}
											{/* Alterado para text-gray-300 */}
											<span className="font-bold text-gray-200">
												{selectedInstanceDetails.messagesSent}
											</span>
										</p>
										<p className="flex justify-between">
											<span className="text-gray-300">
												Tempo de Aquecimento:
											</span>{" "}
											{/* Alterado para text-gray-300 */}
											<span className="font-bold text-gray-200">
												{selectedInstanceDetails.warmupTime} min
											</span>
										</p>
									</div>
								</div>

								{/* Coluna de Estatísticas de Mídia */}
								<div className="bg-gray-100 dark:bg-whatsapp-profundo rounded-lg p-4 shadow-md">
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
													<span className="capitalize text-gray-300">
														{type}:
													</span>{" "}
													{/* Alterado para text-gray-300 */}
													<span className="font-bold text-gray-200">
														{count}
													</span>
												</div>
											),
										)}
									</div>
								</div>

								{/* Coluna de Gráfico de Progressão */}
								<div className="bg-gray-100 dark:bg-whatsapp-profundo rounded-lg p-4 shadow-md">
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

							{/* Gráfico Comparativo de Mensagens Enviadas e Recebidas */}
							<div className="mt-8 bg-gray-100 dark:bg-whatsapp-profundo rounded-lg p-4 shadow-md">
								<h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
									Comparativo de Mensagens
								</h4>
								<ResponsiveContainer width="100%" height={300}>
									<AreaChart
										data={[
											{
												name: "Textos",
												enviadas: selectedInstanceDetails.mediaStats.text,
												recebidas:
													selectedInstanceDetails.receivedStats?.text || 0,
											},
											{
												name: "Imagens",
												enviadas: selectedInstanceDetails.mediaStats.image,
												recebidas:
													selectedInstanceDetails.receivedStats?.image || 0,
											},
											{
												name: "Vídeos",
												enviadas: selectedInstanceDetails.mediaStats.video,
												recebidas:
													selectedInstanceDetails.receivedStats?.video || 0,
											},
											{
												name: "Áudios",
												enviadas: selectedInstanceDetails.mediaStats.audio,
												recebidas:
													selectedInstanceDetails.receivedStats?.audio || 0,
											},
											{
												name: "Stickers",
												enviadas: selectedInstanceDetails.mediaStats.sticker,
												recebidas:
													selectedInstanceDetails.receivedStats?.sticker || 0,
											},
										]}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Area
											type="monotone"
											dataKey="enviadas"
											stroke="#8884d8"
											fill="#8884d8"
											fillOpacity={0.3}
											name="Enviadas"
										/>
										<Area
											type="monotone"
											dataKey="recebidas"
											stroke="#82ca9d"
											fill="#82ca9d"
											fillOpacity={0.3}
											name="Recebidas"
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

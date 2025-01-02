/* eslint-disable react/prop-types */
import axios from "axios";
import TypebotConfigForm from "../components/TypebotConfigForm";

import { AnimatePresence, motion } from "framer-motion";
import {
	Activity,
	Layers,
	Plus,
	Power,
	RefreshCw,
	Server,
	Settings,
	Trash2,
	Wifi,
	X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const API_BASE_URL = "http://localhost:3050";
const API_URL = "https://evo.whatlead.com.br";
const API_KEY = "429683C4C977415CAAFCCE10F7D57E11";

const ConnectionStatus = ({ connected }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.8 }}
		animate={{ opacity: 1, scale: 1 }}
		className={`
      inline-flex items-center
      px-4 py-1.5
      rounded-full
      backdrop-blur-md
      ${
				connected
					? "bg-green-400/10 text-green-500 border border-green-500/20"
					: "bg-red-400/10 text-red-500 border border-red-500/20"
			}
    `}
	>
		<Activity className={`w-3 h-3 mr-2 ${connected ? "animate-pulse" : ""}`} />
		<span className="text-xs font-semibold">
			{connected ? "Online" : "Offline"}
		</span>
	</motion.div>
);

const InstanceCard = ({
	instance,
	onReconnect,
	onLogout,
	onDelete,
	onConfigureTypebot,
	deletingInstance,
}) => {
	const isConnected = instance.connectionStatus === "open";

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="
        relative
        backdrop-blur-lg
        bg-white/10
        dark:bg-gray-800/50
        rounded-3xl
        p-6
        shadow-2xl
        border border-gray-200/20
        dark:border-gray-700/30
        overflow-hidden
      "
		>
			<div className="relative z-10 space-y-6">
				<div className="flex justify-between items-center">
					<div className="flex items-center space-x-4">
						<Server
							className={`
                w-8 h-8
                ${isConnected ? "text-green-500" : "text-red-500"}
              `}
						/>
						<div>
							<h3 className="text-xl font-bold">{instance.instanceName}</h3>
							<p className="text-sm text-gray-500">{instance.phoneNumber}</p>
						</div>
					</div>
					<ConnectionStatus connected={isConnected} />
				</div>

				<div className="grid grid-cols-4 gap-3">
					{!isConnected && (
						<motion.button
							onClick={() => onReconnect(instance.instanceName)}
							className="flex items-center justify-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
						>
							<Wifi className="mr-2" /> Conectar
						</motion.button>
					)}
					<motion.button
						onClick={() => onLogout(instance.instanceName)}
						className="flex items-center justify-center bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
					>
						<Power className="mr-2" /> Logout
					</motion.button>
					<motion.button
						onClick={() => onConfigureTypebot(instance)}
						className="flex items-center justify-center bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition"
					>
						<Settings className="mr-2" /> Typebot
					</motion.button>
					<motion.button
						onClick={() => onDelete(instance.instanceId, instance.instanceName)}
						disabled={deletingInstance === instance.instanceId}
						className={`flex items-center justify-center ${
							deletingInstance === instance.instanceId
								? "bg-gray-500 cursor-not-allowed"
								: "bg-red-500 hover:bg-red-600"
						} text-white py-2 rounded transition`}
					>
						{deletingInstance === instance.instanceId ? (
							<div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2" />
						) : (
							<Trash2 className="mr-2" />
						)}
						{deletingInstance === instance.instanceId
							? "Excluindo..."
							: "Excluir"}
					</motion.button>
				</div>
			</div>
		</motion.div>
	);
};

const Numeros = () => {
	const [instances, setInstances] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPlan, setCurrentPlan] = useState("");
	const [instanceLimit, setInstanceLimit] = useState(0);
	const [remainingSlots, setRemainingSlots] = useState(0);
	const [qrCode, setQrCode] = useState(null);
	const [qrCodeError, setQrCodeError] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newInstaceName, setNewInstaceName] = useState("");
	const [showQrCodeModal, setShowQrCodeModal] = useState(false);
	const [selectedInstance, setSelectedInstance] = useState(null);
	const [showTypebotConfig, setShowTypebotConfig] = useState(false);
	const [deletingInstance, setDeletingInstance] = useState(null);

	const handleError = (error) => {
		if (error.response) {
			const status = error.response.status;
			if (status === 401) {
				toast.error("Sessão expirada. Faça login novamente.");
				window.location.href = "/login";
			} else if (status === 403) {
				toast.error("Você não tem permissão para acessar este recurso.");
			} else {
				toast.error(
					error.response.data?.message || "Erro ao carregar instâncias",
				);
			}
		} else if (error.request) {
			toast.error("Sem resposta do servidor. Verifique sua conexão.");
		} else {
			toast.error("Erro ao configurar a requisição.");
		}
	};

	const fetchInstances = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");

			if (!token) {
				toast.error("Token de autenticação não encontrado");
				window.location.href = "/login";
				return;
			}

			const response = await axios.get(`${API_BASE_URL}/api/instances`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			console.log("Dados das instâncias:", response.data);

			const {
				instances: instancesData,
				currentPlan,
				instanceLimit,
				remainingSlots,
			} = response.data;

			setInstances(instancesData || []);
			setCurrentPlan(currentPlan || "");
			setInstanceLimit(instanceLimit || 0);
			setRemainingSlots(remainingSlots || 0);
		} catch (error) {
			console.error("Erro na busca de instâncias:", error);
			handleError(error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateInstance = async () => {
		if (remainingSlots <= 0) {
			toast.error(`Limite de instâncias atingido para o plano ${currentPlan}`);
			return;
		}

		try {
			const token = localStorage.getItem("token");
			const response = await axios.post(
				`${API_BASE_URL}/api/instances/create`,
				{
					instanceName: newInstaceName,
					qrcode: true,
					integration: "WHATSAPP-BAILEYS",
				},
				{ headers: { Authorization: `Bearer ${token}` } },
			);

			console.log("Resposta da API:", response.data); // Adicione este log
			const { qrcode } = response.data;

			// Verifique se o QR code está vindo corretamente
			console.log("QR Code recebido:", qrcode);

			// Ajuste o tratamento do QR code
			if (qrcode && typeof qrcode === "string") {
				setQrCode({ base64: qrcode });
			} else if (qrcode && qrcode.base64) {
				setQrCode(qrcode);
			} else {
				console.error("Formato de QR code inválido:", qrcode);
				toast.error("Erro ao processar QR code");
				return;
			}

			setShowQrCodeModal(true);
			fetchInstances();
			toast.success("Instância criada com sucesso!");
			setIsModalOpen(false);
		} catch (error) {
			console.error("Erro ao criar instância:", error);
			const errorMessage =
				error.response?.data?.message || "Erro desconhecido ao criar instância";
			toast.error(errorMessage);
		}
	};

	const handleReconnectInstance = async (instanceName) => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(
				`${API_URL}/instance/connect/${instanceName}`,
				{
					headers: {
						apikey: API_KEY,
					},
				},
			);

			if (response.status === 200) {
				const qrCodeResponse = await axios.get(
					`${API_URL}/instance/fetchInstances?instanceName=${instanceName}`,
					{
						headers: {
							apikey: API_KEY,
						},
					},
				);

				if (qrCodeResponse.status === 200) {
					if (qrCodeResponse.data && typeof qrCodeResponse.data === "object") {
						if (
							qrCodeResponse.data.instance &&
							qrCodeResponse.data.instance.qrcode
						) {
							setQrCode(qrCodeResponse.data.instance.qrcode);
							setShowQrCodeModal(true);
							toast.success("Instância reconectando...");
							try {
								await axios.put(
									`${API_BASE_URL}/api/instances/instance/${
										instances.find(
											(instance) => instance.instanceName === instanceName,
										).instanceId
									}`,
									{
										connectionStatus: "connecting",
									},
									{
										headers: {
											Authorization: `Bearer ${token}`,
										},
									},
								);
							} catch (error) {
								console.error(
									"Erro ao atualizar status da instância no banco de dados:",
									error,
								);
								toast.error(
									"Erro ao atualizar status da instância no banco de dados",
								);
							}
							fetchInstances();
						} else if (qrCodeResponse.data.code) {
							setQrCode({ base64: qrCodeResponse.data.code });
							setShowQrCodeModal(true);
							toast.success("Instância reconectando...");
							try {
								await axios.put(
									`${API_BASE_URL}/api/instances/instance/${
										instances.find(
											(instance) => instance.instanceName === instanceName,
										).instanceId
									}`,
									{
										connectionStatus: "connecting",
									},
									{
										headers: {
											Authorization: `Bearer ${token}`,
										},
									},
								);
							} catch (error) {
								console.error(
									"Erro ao atualizar status da instância no banco de dados:",
									error,
								);
								toast.error(
									"Erro ao atualizar status da instância no banco de dados",
								);
							}
							fetchInstances();
						} else {
							console.error(
								"Erro: QR code ou code não encontrado na resposta da API:",
								qrCodeResponse.data,
							);
							toast.error("Erro ao obter QR code para reconexão");
						}
					} else {
						console.error(
							"Erro: Resposta da API inválida:",
							qrCodeResponse.data,
						);
						toast.error("Erro ao obter QR code para reconexão");
					}
				} else if (qrCodeResponse.status === 404) {
					console.error(
						"Erro: Instância não encontrada na API externa:",
						qrCodeResponse.data,
					);
					toast.error(
						"Instância não encontrada na API externa. Verifique o nome da instância.",
					);
				} else {
					console.error("Erro: Resposta da API inválida:", qrCodeResponse.data);
					toast.error("Erro ao obter QR code para reconexão");
				}
			} else {
				toast.error("Erro ao tentar reconectar a instância");
			}
		} catch (error) {
			console.error("Erro ao reconectar instância:", error);
			toast.error(
				error.response?.data?.message || "Erro ao tentar reconectar instância",
			);
		}
	};

	const handleLogoutInstance = async (instanceName) => {
		try {
			await axios.delete(`${API_URL}/instance/logout/${instanceName}`, {
				headers: {
					apikey: API_KEY,
				},
			});
			toast.success("Instância desconectada com sucesso!");
			fetchInstances();
		} catch (error) {
			console.error("Erro ao desconectar instância:", error);
			toast.error(
				error.response?.data?.message || "Erro ao desconectar instância",
			);
		}
	};

	const handleConfigureTypebot = (instance) => {
		setSelectedInstance(instance);
		setShowTypebotConfig(true);
	};

	const handleUpdateTypebotConfig = async (config) => {
		try {
			const token = localStorage.getItem("token");
			await axios.put(
				`${API_BASE_URL}/api/instances/instance/${selectedInstance.instanceId}/typebot`,
				config,
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);

			toast.success("Configurações do Typebot atualizadas com sucesso!");
			setShowTypebotConfig(false);
			fetchInstances();
		} catch (error) {
			console.error("Erro ao atualizar configurações do Typebot:", error);
			toast.error("Erro ao atualizar configurações do Typebot");
		}
	};

	const handleDeleteInstance = async (instanceId, instanceName) => {
		setDeletingInstance(instanceId);

		// Adicione uma confirmação
		if (
			!window.confirm(
				`Tem certeza que deseja excluir a instância "${instanceName}"?`,
			)
		) {
			setDeletingInstance(null);
			return;
		}

		try {
			// Primeiro, tenta fazer logout da instância
			try {
				await axios.delete(`${API_URL}/instance/logout/${instanceName}`, {
					headers: {
						apikey: API_KEY,
					},
				});

				// Espera um pouco para garantir que o logout foi processado
				await new Promise((resolve) => setTimeout(resolve, 2000));
			} catch (logoutError) {
				console.error("Erro ao desconectar instância:", logoutError);
				// Continua mesmo se o logout falhar, pois a instância pode já estar desconectada
			}

			// Depois, tenta deletar na API externa
			const externalResponse = await axios.delete(
				`${API_URL}/instance/delete/${instanceName}`,
				{
					headers: {
						apikey: API_KEY,
					},
				},
			);

			// Verifica se a deleção na API externa foi bem-sucedida
			if (
				externalResponse.status === 200 &&
				externalResponse.data.status === "SUCCESS" &&
				!externalResponse.data.error
			) {
				// Se a deleção na API externa foi bem-sucedida, deleta no banco local
				const token = localStorage.getItem("token");
				await axios.delete(
					`${API_BASE_URL}/api/instances/instance/${instanceId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);

				toast.success("Instância excluída com sucesso!");
				fetchInstances();
			} else {
				toast.error("Erro ao excluir instância na API externa");
				console.error(
					"Resposta inesperada da API externa:",
					externalResponse.data,
				);
			}
		} catch (error) {
			console.error("Erro ao excluir instância:", error);

			if (axios.isAxiosError(error)) {
				if (error.response) {
					const status = error.response.status;
					const message =
						error.response.data?.response?.message?.[0] ||
						error.response.data?.message ||
						error.response.data?.error;

					if (status === 404) {
						toast.error(message || "Instância não encontrada na API externa");
					} else if (status === 400) {
						if (message.includes("needs to be disconnected")) {
							toast.error(
								"A instância precisa ser desconectada antes de ser excluída. Tente fazer logout primeiro.",
							);
						} else {
							toast.error(
								message || "Erro ao processar a requisição na API externa",
							);
						}
					} else if (status === 401) {
						toast.error("Sessão expirada. Faça login novamente");
						window.location.href = "/login";
					} else {
						toast.error(message || "Erro ao excluir instância");
					}
				} else if (error.request) {
					toast.error("Erro de conexão com o servidor");
				} else {
					toast.error("Erro ao configurar a requisição");
				}
			} else {
				toast.error("Erro ao excluir instância");
			}
		} finally {
			setDeletingInstance(null);
		}
	};

	const openModal = () => {
		if (remainingSlots <= 0) {
			toast.error(`Limite de instâncias atingido para o plano ${currentPlan}`);
			return;
		}
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setNewInstaceName("");
	};

	const closeQrCodeModal = () => {
		setShowQrCodeModal(false);
		setQrCode(null);
		setQrCodeError(false);
	};

	useEffect(() => {
		fetchInstances();
		setQrCodeError(false);

		const intervalId = setInterval(fetchInstances, 60000);
		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-whatsapp-profundo via-whatsapp-profundo to-whatsapp-profundo p-10">
			<Toaster position="top-right" />

			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="mb-10 flex justify-between items-center">
					<h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-whatsapp-green/40 to-whatsapp-green/80">
						Instâncias WhatsApp
					</h1>

					<div className="flex space-x-4">
						<motion.button
							onClick={fetchInstances}
							className="bg-white/10 p-3 rounded-full shadow-md hover:bg-white/20"
						>
							<RefreshCw className="text-white" />
						</motion.button>
						<motion.button
							onClick={openModal}
							className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl"
						>
							<Plus className="mr-2" /> Nova Instância
						</motion.button>
					</div>
				</div>

				{/* Status Bar */}
				<div className="mb-4 bg-blue-100 dark:bg-whatsapp-prata/20 p-3 rounded text-black dark:text-white flex justify-between items-center">
					<div className="flex space-x-4">
						<span>Plano Atual: {currentPlan || "Free"}</span>
						<span>Limite de Instâncias: {instanceLimit || 0}</span>
						<span>Slots Restantes: {remainingSlots || 0}</span>
					</div>
				</div>

				{/* Instances Grid */}
				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
					</div>
				) : instances.length === 0 ? (
					<div className="text-center bg-white/10 p-10 rounded-xl shadow-lg">
						<Layers className="mx-auto w-16 h-16 text-gray-400 mb-4" />
						<p className="text-gray-300">Nenhuma instância encontrada</p>
					</div>
				) : (
					<motion.div
						layout
						className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
					>
						<AnimatePresence>
							{instances.map((instance) => (
								<InstanceCard
									key={instance.instanceId}
									instance={instance}
									onReconnect={handleReconnectInstance}
									onLogout={handleLogoutInstance}
									onDelete={handleDeleteInstance}
									onConfigureTypebot={handleConfigureTypebot}
									deletingInstance={deletingInstance}
								/>
							))}
						</AnimatePresence>
					</motion.div>
				)}
			</div>

			{/* Modal de Criação de Instância */}
			{isModalOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
				>
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 20, opacity: 0 }}
						className="bg-white dark:bg-whatsapp-profundo p-8 rounded-xl shadow-2xl w-full max-w-md relative"
					>
						<button
							onClick={closeModal}
							className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
						>
							<X className="w-6 h-6" />
						</button>
						<h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
							Criar Nova Instância
						</h2>
						<div className="mb-4">
							<label
								htmlFor="instanceName"
								className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
							>
								Nome da Instância
							</label>
							<input
								type="text"
								id="instanceName"
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-whatsapp-prata leading-tight focus:outline-none focus:shadow-outline"
								placeholder="Ex: Instância Principal"
								value={newInstaceName}
								onChange={(e) => setNewInstaceName(e.target.value)}
							/>
						</div>
						<motion.button
							onClick={handleCreateInstance}
							className="bg-gradient-to-r from-whatsapp-green to-whatsapp-dark text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl w-full"
						>
							Criar Instância
						</motion.button>
					</motion.div>
				</motion.div>
			)}

			{/* Modal do QR Code */}
			{showQrCodeModal && qrCode && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
				>
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 20, opacity: 0 }}
						className="bg-white dark:bg-whatsapp-profundo p-8 rounded-xl shadow-2xl w-full max-w-md relative"
					>
						<button
							onClick={closeQrCodeModal}
							className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
						>
							<X className="w-6 h-6" />
						</button>
						<h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
							QR Code para Conexão
						</h2>
						<img
							src={
								typeof qrCode === "string"
									? `data:image/png;base64,${qrCode}`
									: qrCode.base64
							}
							alt="QR Code"
							className="mx-auto max-w-full h-auto"
							onError={(e) => {
								console.error("Erro ao carregar QR code");
								setQrCodeError(true);
							}}
						/>
						{qrCodeError && (
							<p className="text-red-500 text-center mt-4">
								Erro ao carregar o QR code. Tente fechar e abrir novamente.
							</p>
						)}
						<p className="text-gray-700 dark:text-gray-300 mt-4">
							Use o aplicativo para escanear o QR code e conectar.
						</p>
						<motion.button
							onClick={closeQrCodeModal}
							className="mt-6 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow-md hover:shadow-lg w-full"
						>
							Fechar
						</motion.button>
					</motion.div>
				</motion.div>
			)}

			{/* Modal de Configuração do Typebot */}
			{showTypebotConfig && selectedInstance && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
				>
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 20, opacity: 0 }}
						className="bg-white dark:bg-whatsapp-profundo p-8 rounded-xl shadow-2xl w-full max-w-md relative"
					>
						<button
							onClick={() => setShowTypebotConfig(false)}
							className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
						>
							<X className="w-6 h-6" />
						</button>
						<h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
							Configurações do Typebot
						</h2>
						<TypebotConfigForm
							instance={selectedInstance}
							onUpdate={handleUpdateTypebotConfig}
						/>
					</motion.div>
				</motion.div>
			)}
		</div>
	);
};
export default Numeros;

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
	Activity,
	Layers,
	Plus,
	Power,
	RefreshCw,
	Server,
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

const InstanceCard = ({ instance, onReconnect, onLogout, onDelete }) => {
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

				<div className="grid grid-cols-3 gap-3">
					{!isConnected && (
						<motion.button
							onClick={() => onReconnect(instance.instanceName)}
							className="
                flex items-center justify-center
                bg-blue-500
                text-white
                py-2
                rounded
                hover:bg-blue-600
                transition
              "
						>
							<Wifi className="mr-2" /> Conectar
						</motion.button>
					)}
					<motion.button
						onClick={() => onLogout(instance.instanceName)}
						className="
              flex items-center justify-center
              bg-yellow-500
              text-white
              py-2
              rounded
              hover:bg-yellow-600
              transition
            "
					>
						<Power className="mr-2" /> Logout
					</motion.button>
					<motion.button
						onClick={() => onDelete(instance.instanceId, instance.instanceName)}
						className="
              flex items-center justify-center
              bg-red-500
              text-white
              py-2
              rounded
              hover:bg-red-600
              transition
            "
					>
						<Trash2 className="mr-2" /> Excluir
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
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newInstaceName, setNewInstaceName] = useState("");
	const [showQrCodeModal, setShowQrCodeModal] = useState(false);
	const [selectedInstanceName, setSelectedInstanceName] = useState(null);

	const fetchInstances = async () => {
		try {
			setLoading(true);

			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("Token de autenticação não encontrado");
			}

			const response = await axios.get(`${API_BASE_URL}/instances`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const {
				instances: instancesData,
				currentPlan,
				instanceLimit,
				remainingSlots,
			} = response.data;

			const processedInstances = instancesData.map((instance) => ({
				instanceId: instance._id,
				instanceName: instance.instanceName,
				phoneNumber: instance.number,
				connectionStatus: instance.connectionStatus,
			}));

			setInstances(processedInstances);
			setCurrentPlan(currentPlan);
			setInstanceLimit(instanceLimit);
			setRemainingSlots(remainingSlots);
			setLoading(false);
		} catch (error) {
			console.error("Erro na busca de instâncias:", error);

			if (error.response) {
				switch (error.response.status) {
					case 401:
						toast.error("Sessão expirada. Faça login novamente.");
						break;
					case 403:
						toast.error("Você não tem permissão para acessar este recurso.");
						break;
					default:
						toast.error("Erro ao carregar instâncias");
				}
			} else if (error.request) {
				toast.error("Sem resposta do servidor. Verifique sua conexão.");
			} else {
				toast.error("Erro ao configurar a requisição");
			}

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
				`${API_BASE_URL}/instances/createInstance`,
				{
					instanceName: newInstaceName,
				},
				{ headers: { Authorization: `Bearer ${token}` } },
			);

			const { qrcode } = response.data;
			setQrCode(qrcode);
			setShowQrCodeModal(true);
			fetchInstances();
			toast.success("Instância criada com sucesso!");
			setIsModalOpen(false);
		} catch (error) {
			console.error("Erro ao criar instância:", error);
			toast.error(error.response?.data?.message || "Erro ao criar instância");
		}
	};

	const handleReconnectInstance = async (instanceName) => {
		setSelectedInstanceName(instanceName);
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

				if (qrCodeResponse.status === 200 && qrCodeResponse.data.instance) {
					setQrCode(qrCodeResponse.data.instance.qrcode);
					setShowQrCodeModal(true);
					toast.success("Instância reconectando...");
					fetchInstances();
				} else {
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
			const token = localStorage.getItem("token");
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

	const handleDeleteInstance = async (instanceId, instanceName) => {
		try {
			const token = localStorage.getItem("token");
			await axios.delete(`${API_BASE_URL}/instances/instance/${instanceId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			await axios.delete(`${API_URL}/instance/delete/${instanceName}`, {
				headers: {
					apikey: API_KEY,
				},
			});
			toast.success("Instância excluída com sucesso!");
			fetchInstances();
		} catch (error) {
			console.error("Erro ao excluir instância:", error);
			toast.error(error.response?.data?.message || "Erro ao excluir instância");
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
		setSelectedInstanceName(null);
	};

	useEffect(() => {
		fetchInstances();

		const intervalId = setInterval(fetchInstances, 60000);
		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-10">
			<Toaster position="top-right" />

			<div className="max-w-6xl mx-auto">
				<div className="mb-10 flex justify-between items-center">
					<h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
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
							className="
                flex items-center
                bg-gradient-to-r from-blue-500 to-blue-600
                text-white px-4 py-2 rounded-lg
                shadow-lg hover:shadow-xl
              "
						>
							<Plus className="mr-2" /> Nova Instância
						</motion.button>
					</div>
				</div>

				<div className="mb-4 bg-blue-100 dark:bg-gray-800 p-3 rounded text-black dark:text-white flex justify-between items-center">
					<div className="flex space-x-4">
						<span>Plano Atual: {currentPlan}</span>
						<span>Limite de Instâncias: {instanceLimit}</span>
						<span>Slots Restantes: {remainingSlots}</span>
					</div>
				</div>

				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
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
						className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md relative"
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
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								placeholder="Ex: Instância Principal"
								value={newInstaceName}
								onChange={(e) => setNewInstaceName(e.target.value)}
							/>
						</div>
						<motion.button
							onClick={handleCreateInstance}
							className="
                bg-gradient-to-r from-blue-500 to-blue-600
                text-white px-4 py-2 rounded-lg
                shadow-lg hover:shadow-xl
              "
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
						className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md relative"
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
						<img src={qrCode.base64} alt="QR Code" className="mx-auto" />
						<p className="text-gray-700 dark:text-gray-300 mt-4">
							Use o aplicativo para escanear o QR code e conectar.
						</p>
						<motion.button
							onClick={closeQrCodeModal}
							className="
                mt-6
                bg-gray-300
                dark:bg-gray-700
                text-gray-800
                dark:text-gray-200
                px-4 py-2 rounded-lg
                shadow-md hover:shadow-lg
              "
						>
							Fechar
						</motion.button>
					</motion.div>
				</motion.div>
			)}
		</div>
	);
};

export default Numeros;

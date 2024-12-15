import { AnimatePresence, motion } from "framer-motion"; // Importando AnimatePresence corretamente
import {
	Activity,
	Layers,
	Plus,
	Power,
	RefreshCw,
	Server,
	Trash2,
	Wifi,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const API_BASE_URL = "https://evo.whatlead.com.br";
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
	const isConnected = instance.connectionState === "connected";

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
			<div
				className="
        absolute
        inset-0
        bg-gradient-to-r
        from-blue-500/10
        via-purple-500/10
        to-pink-500/10
        opacity-30
        pointer-events-none
      "
			/>

			<div className="relative z-10 space-y-6">
				<div className="flex justify-between items-center">
					<div className="flex items-center space-x-4">
						<div
							className="
              relative
              w-12 h-12
              rounded-2xl
              bg-gradient-to-br
              from-blue-500
              to-purple-600
              p-0.5
            "
						>
							<div
								className="
                absolute
                inset-0
                bg-white
                dark:bg-gray-800
                rounded-2xl
                m-[1px]
                flex
                items-center
                justify-center
              "
							>
								<Server
									className={`
                  w-6 h-6
                  ${isConnected ? "text-green-500" : "text-red-500"}
                `}
								/>
							</div>
						</div>
						<div>
							<h3
								className="
                text-xl
                font-bold
                bg-clip-text text-transparent
                bg-gradient-to-r
                from-blue-500
                to-purple-600
              "
							>
								{instance.instanceName}
							</h3>
							<div className="flex items-center space-x-2 mt-1">
								<Layers className="w-3 h-3 text-gray-400" />
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{instance.phoneNumber}
								</p>
							</div>
						</div>
					</div>
					<ConnectionStatus connected={isConnected} />
				</div>

				<div className="grid grid-cols-3 gap-3">
					{!isConnected && (
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => onReconnect(instance.instanceName)}
							className="
                flex items-center justify-center
                bg-gradient-to-r
                from-blue-500
                to-blue-600
                text-white
                py-2.5
                rounded-xl
                shadow-lg
                shadow-blue-500/20
                hover:shadow-blue-500/30
                transition-all
                duration-200
              "
						>
							<Wifi className="mr-2 w-4 h-4" />
							<span className="text-sm font-medium">Conectar</span>
						</motion.button>
					)}
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => onLogout(instance.instanceName)}
						className="
              flex items-center justify-center
              bg-gradient-to-r
              from-yellow-500
              to-yellow-600
              text-white
              py-2.5
              rounded-xl
              shadow-lg
              shadow-yellow-500/20
              hover:shadow-yellow-500/30
              transition-all
              duration-200
            "
					>
						<Power className="mr-2 w-4 h-4" />
						<span className="text-sm font-medium">Logout</span>
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => onDelete(instance.instanceName)}
						className="
              flex items-center justify-center
              bg-gradient-to-r
              from-red-500
              to-red-600
              text-white
              py-2.5
              rounded-xl
              shadow-lg
              shadow-red-500/20
              hover:shadow-red-500/30
              transition-all
              duration-200
            "
					>
						<Trash2 className="mr-2 w-4 h-4" />
						<span className="text-sm font-medium">Excluir</span>
					</motion.button>
				</div>
			</div>
		</motion.div>
	);
};

const Numeros = () => {
	const [instances, setInstances] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchInstances = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${API_BASE_URL}/instance/fetchInstances`, {
				headers: {
					apikey: API_KEY,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Erro ao buscar instâncias");
			}

			const data = await response.json();

			const processedInstances = data.map((instance) => ({
				instanceId: instance.instanceName || instance.id,
				instanceName: instance.instanceName,
				phoneNumber: instance.number || instance.phoneNumber,
				connectionState: instance.connectionState || "disconnected",
			}));

			setInstances(processedInstances);
			setLoading(false);
		} catch (error) {
			console.error("Erro na busca de instâncias:", error);
			toast.error("Erro ao carregar instâncias");
			setLoading(false);
		}
	};

	const handleReconnect = async (instanceName) => {
		try {
			const response = await fetch(
				`${API_BASE_URL}/instance/connect/${instanceName}`,
				{
					method: "POST",
					headers: {
						apikey: API_KEY,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						instanceName,
						qrcode: true,
						integration: "WHATSAPP-BAILEYS",
					}),
				},
			);

			if (!response.ok) {
				throw new Error("Erro ao reconectar instância");
			}

			toast.success("Instância reconectada com sucesso");
			fetchInstances();
		} catch (error) {
			toast.error("Erro ao reconectar instância");
		}
	};

	const handleLogout = async (instanceName) => {
		try {
			const response = await fetch(
				`${API_BASE_URL}/instance/logout/${instanceName}`,
				{
					method: "POST",
					headers: {
						apikey: API_KEY,
					},
				},
			);

			if (!response.ok) {
				throw new Error("Erro ao fazer logout");
			}

			toast.success("Logout realizado com sucesso");
			fetchInstances();
		} catch (error) {
			toast.error("Erro ao fazer logout");
		}
	};

	const handleDelete = async (instanceName) => {
		try {
			const response = await fetch(
				`${API_BASE_URL}/instance/delete/${instanceName}`,
				{
					method: "DELETE",
					headers: {
						apikey: API_KEY,
					},
				},
			);

			if (!response.ok) {
				throw new Error("Erro ao excluir instância");
			}

			toast.success("Instância excluída com sucesso");
			fetchInstances();
		} catch (error) {
			toast.error("Erro ao excluir instância");
		}
	};

	useEffect(() => {
		fetchInstances();
		const intervalId = setInterval(fetchInstances, 60000); // Atualiza a cada minuto
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
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={fetchInstances}
							className="
                bg-white/10 p-3 rounded-full
                shadow-md hover:bg-white/20
                transition-colors
              "
						>
							<RefreshCw className="text-white" />
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="
                flex items-center
                bg-gradient-to-r from-blue-500 to-blue-600
                text-white px-4 py-2 rounded-lg
                shadow-lg
                hover:shadow-xl
                transition-all
              "
						>
							<Plus className="mr-2" />
							Nova Instância
						</motion.button>
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
									onReconnect={handleReconnect}
									onLogout={handleLogout}
									onDelete={handleDelete}
								/>
							))}
						</AnimatePresence>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default Numeros;

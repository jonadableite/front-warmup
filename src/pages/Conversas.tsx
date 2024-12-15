import axios from "axios";
import Compressor from "compressorjs";
import { motion } from "framer-motion";
import type React from "react";
import { type ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BsFileText, BsPlay, BsTrash, BsWifi, BsWifiOff } from "react-icons/bs";
import { FaServer } from "react-icons/fa";

// Configurações da API
const LOCAL_BACKEND_URL = "http://localhost:3050/api"; // URL do backend local
const API_KEY = "429683C4C977415CAAFCCE10F7D57E11";

// Emojis para reações
const REACTION_EMOJIS = [
	"👍",
	"❤️",
	"😂",
	"🔥",
	"👏",
	"🤔",
	"😍",
	"🙌",
	"👌",
	"🤯",
];

interface Instancia {
	id: string;
	name: string;
	connectionStatus: string;
	ownerJid: string | null;
	profileName: string | null;
}

interface MediaContent {
	base64: string;
	type: string;
	fileName: string;
	preview?: string;
}

const Conversas: React.FC = () => {
	const [instances, setInstances] = useState<Instancia[]>([]);
	const [selectedInstances, setSelectedInstances] = useState<Set<string>>(
		new Set(),
	);
	const [message, setMessage] = useState<string>("");
	const [texts, setTexts] = useState<string[]>([]);
	const [images, setImages] = useState<MediaContent[]>([]);
	const [videos, setVideos] = useState<MediaContent[]>([]);
	const [audios, setAudios] = useState<MediaContent[]>([]);
	const [mediaType, setMediaType] = useState("image");
	const [loading, setLoading] = useState(false);
	const [isWarmingUp, setIsWarmingUp] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(true); // Estado para alternar entre modos

	useEffect(() => {
		fetchInstances();
	}, []);

	useEffect(() => {
		// Atualiza a classe 'dark' no elemento HTML
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [isDarkMode]);

	const fetchInstances = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				`${LOCAL_BACKEND_URL}/instance/fetchInstances`,
				{
					headers: { apikey: API_KEY },
				},
			);

			const instancesData = response.data.map((instance: any) => ({
				id: instance.id,
				name: instance.name,
				connectionStatus: instance.connectionStatus,
				ownerJid: instance.ownerJid,
				profileName: instance.profileName,
			}));

			setInstances(instancesData);
		} catch (error) {
			console.error("Erro ao buscar instâncias:", error);
			toast.error("Não foi possível carregar as instâncias");
		} finally {
			setLoading(false);
		}
	};

	const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			Array.from(files).forEach((file) => {
				if (mediaType === "image") {
					new Compressor(file, {
						quality: 0.6, // Ajuste a qualidade conforme necessário
						success(result) {
							processFile(result);
						},
						error(err) {
							console.error("Erro ao comprimir imagem:", err.message);
						},
					});
				} else {
					processFile(file);
				}
			});
		}
	};

	const processFile = (file: Blob) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			const base64 = (reader.result as string).split(",")[1];
			const preview = reader.result as string;
			const newMedia: MediaContent = {
				base64,
				type: file.type,
				fileName: (file as File).name,
				preview,
			};

			switch (mediaType) {
				case "image":
					setImages((prev) => [...prev, newMedia]);
					break;
				case "video":
					setVideos((prev) => [...prev, newMedia]);
					break;
				case "audio":
					setAudios((prev) => [...prev, newMedia]);
					break;
			}
		};
		reader.readAsDataURL(file);
	};

	const removeMedia = (index: number, type: string) => {
		switch (type) {
			case "image":
				setImages((prev) => prev.filter((_, i) => i !== index));
				break;
			case "video":
				setVideos((prev) => prev.filter((_, i) => i !== index));
				break;
			case "audio":
				setAudios((prev) => prev.filter((_, i) => i !== index));
				break;
		}
	};

	const handleSaveContent = async () => {
		if (selectedInstances.size < 2) {
			toast.error(
				"Selecione pelo menos duas instâncias para conversar entre elas",
			);
			return;
		}

		if (
			texts.length === 0 &&
			images.length === 0 &&
			videos.length === 0 &&
			audios.length === 0
		) {
			toast.error("Adicione pelo menos um tipo de conteúdo");
			return;
		}

		try {
			const phoneInstances = Array.from(selectedInstances)
				.map((instanceName) => {
					const instance = instances.find((inst) => inst.name === instanceName);
					return {
						phoneNumber: instance?.ownerJid || "",
						instanceId: instanceName,
					};
				})
				.filter((inst) => inst.phoneNumber);

			const payload = {
				phoneInstances: phoneInstances,
				contents: {
					texts: texts,
					images: images.map((img) => img.base64),
					videos: videos.map((vid) => vid.base64),
					audios: audios.map((aud) => aud.base64),
					emojis: REACTION_EMOJIS,
				},
				config: {
					reactionChance: 0.4,
					audioChance: 0.3,
					stickerChance: 0.2,
					minDelay: 3000,
					maxDelay: 90000,
				},
			};

			console.log("Enviando payload para o backend:", payload);

			const localResponse = await axios.post(
				`${LOCAL_BACKEND_URL}/warmup/config`,
				payload,
			);

			console.log("Resposta do backend local:", localResponse.data);

			if (localResponse.data.success) {
				toast.success("Configuração de aquecimento salva com sucesso!");
				setIsWarmingUp(true);
			} else {
				toast.error("Erro ao configurar aquecimento");
			}
		} catch (error: any) {
			console.error("Erro ao salvar conteúdo:", error);
			console.error("Detalhes do erro:", error.response?.data);
			toast.error(error.response?.data?.message || "Falha ao salvar conteúdo");
		}
	};

	const handleStopWarmup = async () => {
		try {
			await axios.post(`${LOCAL_BACKEND_URL}/stop-all`, null, {
				headers: { apikey: API_KEY },
			});
			toast.success("Aquecimento de todas as instâncias parado com sucesso!");
			setIsWarmingUp(false);
		} catch (error: any) {
			console.error("Erro ao parar aquecimento:", error);
			toast.error("Erro ao parar aquecimento de todas as instâncias");
		}
	};

	const toggleInstanceSelection = (instanceName: string) => {
		setSelectedInstances((prev) => {
			const newSelection = new Set(prev);
			if (newSelection.has(instanceName)) {
				newSelection.delete(instanceName);
			} else {
				newSelection.add(instanceName);
			}
			return newSelection;
		});
	};

	const renderStatusIcon = (status: string) => {
		const statusColors = {
			open: "text-green-500",
			connecting: "text-yellow-500",
			close: "text-red-500",
		};

		const StatusIcon = status === "open" ? BsWifi : BsWifiOff;

		return (
			<div
				className={`${statusColors[status as keyof typeof statusColors]} text-2xl`}
			>
				<StatusIcon />
			</div>
		);
	};

	return (
		<div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Cabeçalho */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="flex justify-between items-center border-b border-gray-700 pb-4"
				>
					<div>
						<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
							WhatsApp Warmer
						</h1>
						<p className="text-gray-400">Gerenciamento de Instâncias</p>
					</div>
					<FaServer className="text-4xl text-blue-500" />
					<button
						onClick={() => setIsDarkMode(!isDarkMode)}
						className="ml-4 bg-blue-500 text-white px-3 py-1 rounded"
					>
						Alternar Modo
					</button>
				</motion.div>

				{/* Seletor de Instâncias */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{instances.map((instance) => (
						<motion.div
							key={instance.id}
							whileHover={{ scale: 1.05 }}
							className={`rounded-xl p-4 border ${
								selectedInstances.has(instance.name)
									? "border-blue-500"
									: "border-transparent"
							} hover:border-blue-500/50 transition-all cursor-pointer bg-white dark:bg-gray-800`}
							onClick={() => toggleInstanceSelection(instance.name)}
						>
							<div className="flex justify-between items-center">
								<div>
									<h3 className="font-bold text-lg">{instance.name}</h3>
									<p className="text-sm text-gray-400">
										{instance.profileName}
									</p>
								</div>
								{renderStatusIcon(instance.connectionStatus)}
							</div>
						</motion.div>
					))}
				</div>

				{/* Conteúdo Principal */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Seção de Textos */}
					<div className="rounded-xl p-6 space-y-4 bg-white dark:bg-gray-800">
						<h3 className="text-xl font-semibold flex items-center">
							<BsFileText className="mr-2 text-blue-500" /> Textos de
							Aquecimento
						</h3>
						<textarea
							className="w-full rounded-lg p-3 border bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 transition-colors"
							placeholder="Digite seus textos aqui..."
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
						<button
							onClick={() => {
								if (message.trim()) {
									setTexts((prev) => [...prev, message.trim()]);
									setMessage("");
								}
							}}
							className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
						>
							Adicionar Texto
						</button>

						{texts.length > 0 && (
							<div className="space-y-2 max-h-48 overflow-y-auto">
								{texts.map((text, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										className="flex justify-between items-center p-2 rounded bg-gray-200 dark:bg-gray-700"
									>
										<span>{text}</span>
										<button
											onClick={() => {
												const newTexts = [...texts];
												newTexts.splice(index, 1);
												setTexts(newTexts);
											}}
											className="text-red-500 hover:text-red-600"
										>
											<BsTrash />
										</button>
									</motion.div>
								))}
							</div>
						)}
					</div>

					{/* Seção de Upload */}
					<div className="rounded-xl p-6 space-y-4 bg-white dark:bg-gray-800">
						<h3 className="text-xl font-semibold flex items-center">
							<BsPlay className="mr-2 text-green-500" /> Upload de Mídia
						</h3>
						<select
							className="w-full rounded-lg p-3 border bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
							value={mediaType}
							onChange={(e) => setMediaType(e.target.value)}
						>
							<option value="image">Imagens</option>
							<option value="video">Vídeos</option>
							<option value="audio">Áudios</option>
						</select>
						<input
							type="file"
							multiple
							onChange={handleFileUpload}
							className="w-full rounded-lg p-3 border bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
						/>

						{/* Pré-visualização de Mídias */}
						<div className="grid grid-cols-3 gap-2">
							{mediaType === "image" &&
								images.map((img, index) => (
									<div key={index} className="relative">
										<img
											src={img.preview}
											alt={img.fileName}
											className="w-full h-24 object-cover rounded"
										/>
										<button
											onClick={() => removeMedia(index, "image")}
											className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
										>
											<BsTrash />
										</button>
									</div>
								))}
							{mediaType === "video" &&
								videos.map((vid, index) => (
									<div key={index} className="relative">
										<video
											src={vid.preview}
											className="w-full h-24 object-cover rounded"
											controls
										/>
										<button
											onClick={() => removeMedia(index, "video")}
											className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
										>
											<BsTrash />
										</button>
									</div>
								))}
							{mediaType === "audio" &&
								audios.map((aud, index) => (
									<div key={index} className="relative w-full">
										<audio controls className="w-full">
											<source src={aud.preview} type={aud.type} />
										</audio>
										<button
											onClick={() => removeMedia(index, "audio")}
											className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
										>
											<BsTrash />
										</button>
									</div>
								))}
						</div>
					</div>
				</div>

				{/* Botões de Controle */}
				<div className="flex justify-end space-x-4">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleSaveContent}
						className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-700 transition-all"
					>
						Iniciar Aquecimento
					</motion.button>
					{isWarmingUp && (
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleStopWarmup}
							className="bg-gradient-to-r from-red-500 to-orange-600 px-6 py-3 rounded-lg text-white font-bold hover:from-red-600 hover:to-orange-700 transition-all"
						>
							Parar Aquecimento
						</motion.button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Conversas;

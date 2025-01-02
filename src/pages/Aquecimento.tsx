import axios from "axios";
import Compressor from "compressorjs";
import { motion } from "framer-motion";
import type React from "react";
import { type ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BsFileText, BsPlay, BsTrash, BsWifi, BsWifiOff } from "react-icons/bs";
import { FaServer } from "react-icons/fa";

// Configurações da API
const API_BASE_URL = "https://back.whatlead.com.br";
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

interface PhoneInstance {
	phoneNumber: string;
	instanceId: string;
}

export interface WarmupConfig {
	phoneInstances: PhoneInstance[];
	contents: {
		texts: string[];
		images: string[];
		audios: string[];
		emojis: string[];
		videos: string[];
		stickers: string[];
	};
	config: {
		reactionChance: number;
		audioChance: number;
		stickerChance: number;
		minDelay: number;
		maxDelay: number;
		videoChance: number;
	};
}

const Aquecimento: React.FC = () => {
	const [instances, setInstances] = useState<Instancia[]>([]);
	const [selectedInstances, setSelectedInstances] = useState<Set<string>>(
		new Set(),
	);
	const [message, setMessage] = useState<string>("");
	const [texts, setTexts] = useState<string[]>([]);
	const [images, setImages] = useState<MediaContent[]>([]);
	const [videos, setVideos] = useState<MediaContent[]>([]);
	const [audios, setAudios] = useState<MediaContent[]>([]);
	const [stickers, setStickers] = useState<MediaContent[]>([]);
	const [mediaType, setMediaType] = useState("image");
	const [loading, setLoading] = useState(false);
	const [isWarmingUp, setIsWarmingUp] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(true);
	const [instanceLimit, setInstanceLimit] = useState(0);
	const [remainingSlots, setRemainingSlots] = useState(0);
	const [currentPlan, setCurrentPlan] = useState("free");

	useEffect(() => {
		fetchInstances();
	}, []);

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [isDarkMode]);

	const fetchInstances = async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("Token de autenticação não encontrado");
			}

			const response = await axios.get(`${API_BASE_URL}/api/instances`, {
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

			const processedInstances = instancesData.map((instance: any) => ({
				id: instance._id,
				name: instance.instanceName,
				connectionStatus: instance.connectionStatus,
				ownerJid: instance.ownerJid,
				profileName: instance.profileName,
			}));

			setInstances(processedInstances);
			setCurrentPlan(currentPlan);
			setInstanceLimit(instanceLimit);
			setRemainingSlots(remainingSlots);
		} catch (error: any) {
			console.error("Erro ao buscar instâncias:", error);
			toast.error(error.message || "Não foi possível carregar as instâncias");
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
						quality: 0.6,
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
				case "sticker":
					setStickers((prev) => [...prev, newMedia]);
					break;
			}
		};
		reader.readAsDataURL(file);
	};

	const processBase64 = (base64String: string, type: string) => {
		if (!base64String.startsWith("data:")) {
			return `data:${type};base64,${base64String}`;
		}
		return base64String;
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
			case "sticker":
				setStickers((prev) => prev.filter((_, i) => i !== index));
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
			audios.length === 0 &&
			videos.length === 0 &&
			stickers.length === 0
		) {
			toast.error("Adicione pelo menos um tipo de conteúdo");
			return;
		}

		try {
			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("Token de autenticação não encontrado");
			}

			const phoneInstances: PhoneInstance[] = instances
				.filter((instance) => {
					const isSelected = selectedInstances.has(instance.name);
					const hasValidPhoneNumber =
						instance.ownerJid && instance.ownerJid.trim() !== "";

					return isSelected && hasValidPhoneNumber;
				})
				.map((instance) => ({
					phoneNumber: instance.ownerJid ? instance.ownerJid.trim() : "",
					instanceId: instance.name,
				}));

			if (phoneInstances.length < 2) {
				toast.error("Selecione pelo menos duas instâncias com números válidos");
				return;
			}

			const config = {
				reactionChance: 0.4,
				audioChance: 0.3,
				stickerChance: 0.2,
				minDelay: 3000,
				maxDelay: 90000,
				videoChance: 0.2,
			};

			const contents = {
				texts: texts,
				images: images.map((img) => processBase64(img.base64, img.type)),
				audios: audios.map((aud) => processBase64(aud.base64, aud.type)),
				emojis: REACTION_EMOJIS,
				videos: videos.map((vid) => processBase64(vid.base64, vid.type)),
				stickers: stickers.map((sticker) =>
					processBase64(sticker.base64, sticker.type),
				),
			};

			const payload = {
				phoneInstances: phoneInstances,
				contents: contents,
				config: config,
			};

			console.log("Payload final:", payload);

			const localResponse = await axios.post(
				`${API_BASE_URL}/warmup/config`,
				payload,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (localResponse.data.success) {
				toast.success("Configuração de aquecimento salva com sucesso!");
				setIsWarmingUp(true);
			} else {
				toast.error("Erro ao configurar aquecimento");
			}
		} catch (error: any) {
			console.error("Erro ao salvar conteúdo:", error);
			toast.error(error.response?.data?.message || "Falha ao salvar conteúdo");
		}
	};

	const handleStopWarmup = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("Token de autenticação não encontrado");
			}
			await axios.post(
				`${API_BASE_URL}/warmup/stop-all`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
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
			disconnected: "text-red-500",
		};

		const StatusIcon = status === "open" ? BsWifi : BsWifiOff;

		return (
			<div
				className={`${
					statusColors[status as keyof typeof statusColors]
				} text-2xl`}
			>
				<StatusIcon />
			</div>
		);
	};

	return (
		<div className="min-h-screen p-6 bg-gray-100 dark:bg-whatsapp-profundo text-black dark:text-white">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Cabeçalho */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="flex justify-between items-center border-b border-gray-700 pb-4"
				>
					<div>
						<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-whatsapp-green to-whatsapp-light">
							WhatsApp Warmer
						</h1>
						<p className="text-gray-400">Gerenciamento de Instâncias</p>
					</div>
					<FaServer className="text-4xl text-whatsapp-eletrico" />
				</motion.div>

				{/* Informações de Plano */}
				<div className="mb-4 bg-blue-100 dark:bg-whatsapp-cinza p-3 rounded text-black dark:text-white flex justify-between items-center">
					<div className="flex space-x-3">
						<span>Plano Atual: {currentPlan}</span>
						<span>Limite de Instâncias: {instanceLimit}</span>
						<span>Slots Restantes: {remainingSlots}</span>
					</div>
				</div>

				{/* Seletor de Instâncias */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{instances.map((instance) => (
						<motion.div
							key={instance.id}
							whileHover={{ scale: 1.05 }}
							className={`rounded-xl p-4 border ${
								selectedInstances.has(instance.name)
									? "border-whatsapp-eletrico"
									: "border-transparent"
							} hover:border-whatsapp-eletrico/50 transition-all cursor-pointer bg-white dark:bg-whatsapp-profundo`}
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
					<div className="rounded-xl p-6 space-y-4 bg-white dark:bg-whatsapp-cinza">
						<h3 className="text-xl font-semibold flex items-center">
							<BsFileText className="mr-2 text-whatsapp-eletrico" /> Textos de
							Aquecimento
						</h3>
						<textarea
							className="w-full rounded-lg p-3 border bg-gray-100 dark:bg-whatsapp-cinza border-whatsapp-light dark:border-x-whatsapp-dark focus:border-x-whatsapp-dark transition-colors"
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
							className="bg-whatsapp-dark hover:bg-whatsapp-green text-white px-4 py-2 rounded-lg transition-colors"
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
										className="flex justify-between items-center p-2 rounded bg-gray-200 dark:bg-whatsapp-cinza"
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
					<div className="rounded-xl p-6 space-y-4 bg-white dark:bg-whatsapp-cinza">
						<h3 className="text-xl font-semibold flex items-center">
							<BsPlay className="mr-2 text-green-500" /> Upload de Mídia
						</h3>
						<select
							className="w-full rounded-lg p-3 border bg-whatsapp-light dark:bg-whatsapp-profundo/50 border-whatsapp-light dark:border-x-whatsapp-cinzaClaro"
							value={mediaType}
							onChange={(e) => setMediaType(e.target.value)}
						>
							<option value="image">Imagens</option>
							<option value="video">Vídeos</option>
							<option value="audio">Áudios</option>
							<option value="sticker">Stickers</option>
						</select>
						<input
							type="file"
							multiple
							onChange={handleFileUpload}
							className="w-full rounded-lg p-3 border bg-whatsapp-light dark:bg-whatsapp-profundo/50 border-gray-300 dark:border-x-whatsapp-cinzaClaro"
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
							{mediaType === "sticker" &&
								stickers.map((sticker, index) => (
									<div key={index} className="relative">
										<img
											src={sticker.preview}
											alt={sticker.fileName}
											className="w-full h-24 object-cover rounded"
										/>
										<button
											onClick={() => removeMedia(index, "sticker")}
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
						className="bg-gradient-to-r from-whatsapp-dark to-whatsapp-light/40 px-6 py-3 rounded-lg text-white font-bold hover:from-whatsapp-green/40 hover:to-whatsapp-green transition-all"
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

export default Aquecimento;

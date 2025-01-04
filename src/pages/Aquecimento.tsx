import axios from "axios";
import Compressor from "compressorjs";
import { motion } from "framer-motion";
import type React from "react";
import { type ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BsFileText, BsPlay, BsTrash, BsWifi, BsWifiOff } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";

// Configurações da API
const API_BASE_URL = "http://localhost:3050";
const API_KEY = "429683C4C977415CAAFCCE10F7D57E11";

const SyncButton: React.FC<{ onClick: () => void; loading: boolean }> = ({
	onClick,
	loading,
}) => {
	return (
		<motion.button
			onClick={onClick}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			className={`
        flex items-center gap-2 px-4 py-2
        rounded-lg text-sm font-medium
        transition-all duration-300
        bg-gradient-to-r from-whatsapp-eletrico/10 to-whatsapp-green/5
        hover:from-whatsapp-eletrico/20 hover:to-whatsapp-green/10
        border border-whatsapp-eletrico/30
        text-whatsapp-eletrico
        shadow-lg hover:shadow-xl
        backdrop-blur-sm
      `}
			disabled={loading}
		>
			<motion.div
				animate={loading ? { rotate: 360 } : { rotate: 0 }}
				transition={{
					duration: 1,
					ease: "linear",
					repeat: loading ? Number.POSITIVE_INFINITY : 0,
					repeatType: "loop",
				}}
			>
				<svg
					className="w-5 h-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					{loading ? (
						// Ícone de loading circular
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10">
							<animateTransform
								attributeName="transform"
								type="rotate"
								from="0 12 12"
								to="360 12 12"
								dur="1s"
								repeatCount="indefinite"
							/>
						</path>
					) : (
						// Ícone de sincronização
						<>
							<path d="M21 2v6h-6" />
							<path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
							<path d="M3 22v-6h6" />
							<path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
						</>
					)}
				</svg>
			</motion.div>
			{loading ? "Sincronizando..." : "Sincronizar"}
		</motion.button>
	);
};

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
	type: "image" | "video" | "audio" | "sticker";
	base64: string;
	fileName: string;
	mimetype: string;
	caption?: string;
}

interface PhoneInstance {
	phoneNumber: string;
	instanceId: string;
}

export interface WarmupConfig {
	sessionId: string;
	phoneInstances: PhoneInstance[];
	contents: {
		texts: string[];
		images: {
			type: string;
			base64: string;
			fileName: string;
			mimetype: string;
		}[];
		audios: {
			type: string;
			base64: string;
			fileName: string;
			mimetype: string;
		}[];
		videos: {
			type: string;
			base64: string;
			fileName: string;
			mimetype: string;
		}[];
		stickers: {
			type: string;
			base64: string;
			fileName: string;
			mimetype: string;
		}[];
		emojis: string[];
	};
	config: {
		textChance: number;
		audioChance: number;
		reactionChance: number;
		stickerChance: number;
		imageChance: number;
		videoChance: number;
		minDelay: number;
		maxDelay: number;
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

	axios.interceptors.request.use(
		(config) => {
			return config;
		},
		(error) => {
			console.error("Erro na requisição:", error);
			return Promise.reject(error);
		},
	);

	axios.interceptors.response.use(
		(response) => {
			return response;
		},
		(error) => {
			console.error("Erro na resposta:", {
				status: error.response?.status,
				data: error.response?.data,
				message: error.message,
			});
			return Promise.reject(error);
		},
	);

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
				id: instance.instanceId || instance.id,
				name: instance.instanceName,
				connectionStatus: instance.connectionStatus,
				ownerJid: instance.ownerJid || instance.number || instance.phoneNumber,
				profileName: instance.profileName,
			}));

			console.log("Instâncias brutas:", instancesData);
			console.log("Instâncias processadas:", processedInstances);
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

	const compressImage = async (file: File, maxSizeMB = 2): Promise<Blob> => {
		return new Promise((resolve, reject) => {
			new Compressor(file, {
				quality: 0.8, // Qualidade inicial mais alta
				maxWidth: 1920, // Resolução máxima mais alta
				maxHeight: 1080,
				success(result) {
					if (result.size > maxSizeMB * 1024 * 1024) {
						// Se ainda estiver muito grande, comprimir mais
						new Compressor(file, {
							quality: 0.6,
							maxWidth: 1280,
							maxHeight: 720,
							success: resolve,
							error: reject,
						});
					} else {
						resolve(result);
					}
				},
				error: reject,
			});
		});
	};

	const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files) return;

		const maxTotalSize = 50 * 1024 * 1024; // 50MB total
		const maxFileSize = 10 * 1024 * 1024; // 10MB por arquivo

		const totalSize = Array.from(files).reduce(
			(acc, file) => acc + file.size,
			0,
		);
		if (totalSize > maxTotalSize) {
			toast.error("O tamanho total dos arquivos excede 50MB");
			return;
		}

		setLoading(true);
		try {
			for (const file of Array.from(files)) {
				if (file.size > maxFileSize) {
					toast.error(`O arquivo ${file.name} excede 10MB`);
					continue;
				}

				if (mediaType === "image") {
					const compressedFile = await compressImage(file);
					await processFile(compressedFile);
				} else {
					await processFile(file);
				}
			}
			toast.success("Arquivos processados com sucesso!");
		} catch (error) {
			console.error("Erro ao processar arquivos:", error);
			toast.error("Erro ao processar arquivos");
		} finally {
			setLoading(false);
		}
	};

	const processFile = async (file: Blob): Promise<void> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				try {
					const base64String = reader.result as string;
					const base64Data = base64String.split(",")[1];

					const getMimetype = (type: string) => {
						switch (type) {
							case "image":
								return "image/jpeg";
							case "video":
								return "video/mp4";
							case "audio":
								return "audio/mp3";
							case "sticker":
								return "image/webp";
							default:
								return file.type;
						}
					};

					const newMedia: MediaContent = {
						type: mediaType as "image" | "video" | "audio" | "sticker",
						base64: base64Data,
						fileName: (file as File).name,
						mimetype: getMimetype(mediaType),
						preview: base64String,
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
					resolve();
				} catch (error) {
					reject(error);
				}
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	const handleSaveContent = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("Token de autenticação não encontrado");
			}

			// Validações
			if (selectedInstances.size < 2) {
				toast.error("Selecione pelo menos duas instâncias");
				return;
			}

			const phoneInstances = instances
				.filter((instance) => {
					const isSelected = selectedInstances.has(instance.name);
					const hasValidPhoneNumber = instance.ownerJid?.trim();
					return isSelected && hasValidPhoneNumber;
				})
				.map((instance) => ({
					phoneNumber: instance.ownerJid!.trim().replace("@s.whatsapp.net", ""),
					instanceId: instance.name,
				}));

			// Preparar textos (formato correto)
			const prepareTexts = texts.map((text) => text); // Apenas o texto, sem objeto

			const payload = {
				phoneInstances,
				contents: {
					texts: prepareTexts,
					images: images.map((img) => ({
						type: "image",
						base64: img.base64,
						fileName: img.fileName,
						mimetype: img.mimetype,
					})),
					audios: audios.map((audio) => ({
						type: "audio",
						base64: audio.base64,
						fileName: audio.fileName,
						mimetype: audio.mimetype,
					})),
					videos: videos.map((video) => ({
						type: "video",
						base64: video.base64,
						fileName: video.fileName,
						mimetype: video.mimetype,
					})),
					stickers: stickers.map((sticker) => ({
						type: "sticker",
						base64: sticker.base64,
						fileName: sticker.fileName,
						mimetype: sticker.mimetype,
					})),
					emojis: REACTION_EMOJIS,
				},
				config: {
					textChance: 0.8,
					audioChance: 0.3,
					reactionChance: 0.4,
					stickerChance: 0.2,
					imageChance: 0.3,
					videoChance: 0.1,
					minDelay: 3000,
					maxDelay: 90000,
				},
			};

			console.log("Payload sendo enviado:", payload);

			const response = await axios.post(
				`${API_BASE_URL}/api/warmup/config`,
				payload,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (response.data.success) {
				setIsWarmingUp(true);
				toast.success("Aquecimento iniciado com sucesso!");
			}
		} catch (error: any) {
			console.error("Erro ao iniciar aquecimento:", error);
			toast.error(
				error.response?.data?.message || "Erro ao iniciar aquecimento",
			);
		} finally {
			setLoading(false);
		}
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

	useEffect(() => {
		let interval: NodeJS.Timeout;

		const checkWarmupStatus = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) return;

				const response = await axios.get(`${API_BASE_URL}/api/warmup/status`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.data.globalStatus !== "active") {
					setIsWarmingUp(false);
					clearInterval(interval);
				}
			} catch (error) {
				console.error("Erro ao verificar status:", error);
			}
		};

		if (isWarmingUp) {
			interval = setInterval(checkWarmupStatus, 5000);
			checkWarmupStatus(); // Verificar imediatamente
		} else {
			if (interval) {
				clearInterval(interval);
			}
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [isWarmingUp]);

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

	const handleStopWarmup = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("Token de autenticação não encontrado");
			}

			await axios.post(
				`${API_BASE_URL}/api/warmup/stop-all`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			setIsWarmingUp(false);
			toast.success("Aquecimento parado com sucesso!");
		} catch (error: any) {
			console.error("Erro ao parar aquecimento:", error);
			toast.error(error.response?.data?.message || "Erro ao parar aquecimento");
		} finally {
			setLoading(false);
		}
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
						<h2 className="text-lg text-whatsapp-cinzaClaro">
							Gerenciamento de Instâncias
						</h2>
					</div>
					<SyncButton onClick={fetchInstances} loading={loading} />
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
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{instances.map((instance) => (
						<motion.div
							key={`instance-${instance.id}`}
							whileHover={{ scale: 1.02 }}
							className={`
        relative backdrop-blur-lg rounded-xl p-6
        ${
					selectedInstances.has(instance.name)
						? "bg-gradient-to-br from-whatsapp-eletrico/20 to-whatsapp-green/5 border-2 border-whatsapp-eletrico"
						: "bg-gradient-to-br from-whatsapp-profundo/80 to-whatsapp-cinza/50 border border-whatsapp-green/30"
				}
        shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer
        overflow-hidden group
      `}
							onClick={() => toggleInstanceSelection(instance.name)}
						>
							{/* Efeito de brilho no hover */}
							<div className="absolute inset-0 bg-gradient-to-tr from-whatsapp-eletrico/10 to-whatsapp-luminoso/5 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />

							{/* Indicador de seleção */}
							{selectedInstances.has(instance.name) && (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className="absolute -top-1 -right-1 bg-whatsapp-eletrico text-white p-2 rounded-bl-xl"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</motion.div>
							)}

							<div className="relative z-10 space-y-4">
								{/* Cabeçalho do Card */}
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div
											className={`
                p-3 rounded-full
                ${
									instance.connectionStatus === "open"
										? "bg-whatsapp-green/20"
										: "bg-red-500/20"
								}
              `}
										>
											<FaWhatsapp
												className={`
                  w-6 h-6
                  ${
										instance.connectionStatus === "open"
											? "text-whatsapp-green animate-pulse"
											: "text-red-500"
									}
                `}
											/>
										</div>
										<div>
											<h3 className="text-xl font-bold text-whatsapp-branco">
												{instance.name}
											</h3>
											<p className="text-sm text-whatsapp-cinzaClaro">
												{instance.profileName || "Sem nome de perfil"}
											</p>
										</div>
									</div>

									<div
										className={`
              px-3 py-1 rounded-full text-sm
              ${
								instance.connectionStatus === "open"
									? "bg-green-500/20 text-green-400"
									: "bg-red-500/20 text-red-400"
							}
            `}
									>
										{instance.connectionStatus === "open"
											? "Online"
											: "Offline"}
									</div>
								</div>

								{/* Status da Conexão */}
								<div
									className={`
            flex items-center space-x-2 p-2 rounded-lg
            ${
							instance.connectionStatus === "open"
								? "bg-green-500/10 text-green-400 border border-green-500/20"
								: "bg-red-500/10 text-red-400 border border-red-500/20"
						}
          `}
								>
									<div
										className={`
              w-2 h-2 rounded-full
              ${
								instance.connectionStatus === "open"
									? "bg-green-400 animate-pulse"
									: "bg-red-400"
							}
            `}
									/>
									<span className="text-sm font-medium flex items-center gap-1">
										{instance.connectionStatus === "open" ? (
											<>
												<BsWifi className="w-3 h-3" />
												Conectado
											</>
										) : (
											<>
												<BsWifiOff className="w-3 h-3" />
												Desconectado
											</>
										)}
									</span>
								</div>

								{/* Número do WhatsApp */}
								{instance.ownerJid && (
									<div className="text-sm text-whatsapp-cinzaClaro/80 pt-2 border-t border-whatsapp-cinza/20">
										<div className="flex items-center space-x-2">
											<FaWhatsapp className="w-4 h-4 text-whatsapp-green/60" />
											<p className="truncate">
												{instance.ownerJid.split("@")[0]}
											</p>
										</div>
									</div>
								)}
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
										key={`text-${index}`}
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
									<div key={`image-${index}`} className="relative">
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
									<div key={`video-${index}`} className="relative">
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
									<div key={`audio-${index}`} className="relative w-full">
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
									<div key={`sticker-${index}`} className="relative">
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
						disabled={loading}
						className={`
            flex items-center gap-2 px-6 py-3 rounded-lg
            ${
							loading
								? "bg-gray-500 cursor-not-allowed"
								: "bg-gradient-to-r from-whatsapp-dark to-whatsapp-light/40"
						}
            text-white font-bold transition-all
        `}
					>
						{loading ? (
							<>
								<svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
										fill="none"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								Iniciando...
							</>
						) : (
							"Iniciar Aquecimento"
						)}
					</motion.button>

					{isWarmingUp && (
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleStopWarmup}
							className="bg-gradient-to-r from-red-500 to-orange-600 px-6 py-3 rounded-lg text-white font-bold hover:from-red-600 hover:to-orange-700 transition-all"
							disabled={loading}
						>
							{loading ? (
								<div className="flex items-center">
									<svg
										className="animate-spin h-5 w-5 mr-3"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
											fill="none"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									Parando...
								</div>
							) : (
								"Parar Aquecimento"
							)}
						</motion.button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Aquecimento;

// src/pages/FileUpload.tsx
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Copy, Eye, Upload, X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const API_BASE_URL = "https://aquecerapi.whatlead.com.br";

const FileUpload: React.FC = () => {
	const [file, setFile] = useState<File | null>(null);
	const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Lista expandida de tipos MIME permitidos
	const allowedFileTypes = `
        Imagens: .jpg, .jpeg, .png, .gif, .webp, .svg
        Áudio: .mp3, .wav, .ogg, .aac, .midi, .webm, .3gp, .m4a
        Vídeo: .mp4, .mpeg, .webm, .3gp, .avi, .mov, .wmv
        Documentos: .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt
        Outros: .zip, .rar, .7z, .json, .csv, .xml
    `;

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			const preview = handlePreview(selectedFile);
			if (preview) {
				setPreviewUrl(preview);
			}
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const droppedFile = event.dataTransfer.files[0];
		if (droppedFile) {
			setFile(droppedFile);
			const preview = handlePreview(droppedFile);
			if (preview) {
				setPreviewUrl(preview);
			}
		}
	};

	const handleUpload = async () => {
		if (!file) {
			toast.error("Por favor, selecione um arquivo para upload.");
			return;
		}

		setIsUploading(true);
		const formData = new FormData();
		formData.append("file", file);

		try {
			const token = localStorage.getItem("token");
			const response = await axios.post(
				`${API_BASE_URL}/api/upload`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token}`,
					},
				},
			);

			// Ajuste aqui para pegar a URL correta da resposta
			const fileUrl = response.data.files?.[0]?.url || response.data.url;

			if (fileUrl) {
				setUploadedFileUrl(fileUrl);
				toast.success("Arquivo enviado com sucesso!");
			} else {
				throw new Error("URL do arquivo não encontrada na resposta");
			}

			// Atualizar preview se for uma imagem
			if (file.type.startsWith("image/")) {
				setPreviewUrl(fileUrl);
			}
		} catch (error) {
			console.error("Erro ao fazer upload:", error);
			toast.error(
				error.response?.data?.error ||
					"Erro ao enviar arquivo. Tente novamente.",
			);
		} finally {
			setIsUploading(false);
		}
	};

	const handlePreview = (file: File) => {
		if (file.type.startsWith("image/")) {
			return URL.createObjectURL(file);
		} else if (file.type.startsWith("video/")) {
			return URL.createObjectURL(file);
		} else if (file.type.startsWith("audio/")) {
			return URL.createObjectURL(file);
		}
		return null;
	};

	const renderPreview = () => {
		if (!file) return null;

		if (file.type.startsWith("image/")) {
			return (
				<img
					src={previewUrl}
					alt="Preview"
					className="max-w-full h-auto rounded"
				/>
			);
		} else if (file.type.startsWith("video/")) {
			return (
				<video controls className="max-w-full h-auto rounded" src={previewUrl}>
					Seu navegador não suporta o elemento de vídeo.
				</video>
			);
		} else if (file.type.startsWith("audio/")) {
			return (
				<audio controls className="w-full mt-2" src={previewUrl}>
					Seu navegador não suporta o elemento de áudio.
				</audio>
			);
		} else {
			return (
				<div className="flex items-center text-whatsapp-cinzaClaro">
					<Eye className="mr-2" />
					Pré-visualização não disponível para {file.type}
				</div>
			);
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(uploadedFileUrl);
		toast.success("URL copiada para a área de transferência!");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-whatsapp-profundo via-whatsapp-profundo to-whatsapp-profundo px-4 sm:px-6 lg:px-8 py-10">
			<Toaster position="top-right" />

			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-whatsapp-green to-whatsapp-light mb-8">
					Upload de Arquivos
				</h1>

				<motion.div
					className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div
						className="border-4 border-dashed border-whatsapp-green/30 rounded-xl p-8 text-center cursor-pointer"
						onDragOver={handleDragOver}
						onDrop={handleDrop}
						onClick={() => fileInputRef.current?.click()}
					>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileChange}
							className="hidden"
						/>
						<Upload className="mx-auto h-12 w-12 text-whatsapp-green mb-4" />
						<p className="text-whatsapp-branco">
							Arraste e solte um arquivo aqui, ou clique para selecionar
						</p>

						<p className="text-whatsapp-cinzaClaro text-sm mt-2">
							Formatos suportados: {allowedFileTypes}
						</p>
					</div>

					{file && (
						<div className="mt-6 p-4 bg-black/20 backdrop-blur-md rounded-xl border border-whatsapp-green/20">
							<div className="flex items-center justify-between">
								<p className="text-whatsapp-branco">{file.name}</p>
								<button
									onClick={() => {
										setFile(null);
										setPreviewUrl("");
									}}
									className="text-red-500 hover:text-red-600"
								>
									<X />
								</button>
							</div>
							<div className="mt-4">{renderPreview()}</div>
						</div>
					)}

					<motion.button
						onClick={handleUpload}
						disabled={!file || isUploading}
						className={`mt-6 w-full ${buttonVariants.upload} ${
							!file || isUploading ? "opacity-50 cursor-not-allowed" : ""
						}`}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						{isUploading ? <LoadingSpinner /> : "Enviar Arquivo"}
					</motion.button>

					<AnimatePresence>
						{uploadedFileUrl && (
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="mt-6 p-4 bg-black/20 backdrop-blur-md rounded-xl border border-whatsapp-green/20"
							>
								<div className="flex items-center justify-between mb-2">
									<p className="text-whatsapp-green font-semibold">
										URL do arquivo:
									</p>
									<button
										onClick={copyToClipboard}
										className="text-whatsapp-branco hover:text-whatsapp-green"
									>
										<Copy />
									</button>
								</div>
								<p className="text-whatsapp-branco break-all">
									{uploadedFileUrl}
								</p>
								<div className="mt-4 flex items-center text-whatsapp-cinzaClaro">
									<CheckCircle className="mr-2 text-whatsapp-green" />
									Arquivo enviado com sucesso!
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>
		</div>
	);
};

const LoadingSpinner: React.FC = () => (
	<motion.div
		animate={{ rotate: 360 }}
		transition={{
			duration: 1,
			repeat: Number.POSITIVE_INFINITY,
			ease: "linear",
		}}
		className="w-5 h-5 border-2 border-white rounded-full border-t-transparent"
	/>
);

const buttonVariants = {
	upload:
		"flex items-center justify-center py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 backdrop-blur-md font-medium text-sm bg-gradient-to-r from-whatsapp-green to-whatsapp-dark text-white",
};

export default FileUpload;

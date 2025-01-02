import React, { useState } from "react";

const TypebotConfigForm = ({ instance, onUpdate }) => {
	const [config, setConfig] = useState({
		typebotUrl: instance?.typebotUrl || "",
		typebot: instance?.typebot || "",
		typebotExpire: instance?.typebotExpire || 300,
		typebotKeywordFinish: instance?.typebotKeywordFinish || "sair",
		typebotDelayMessage: instance?.typebotDelayMessage || 2000,
		typebotUnknownMessage: instance?.typebotUnknownMessage || "",
		typebotListeningFromMe: instance?.typebotListeningFromMe || false,
	});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setConfig((prev) => ({
			...prev,
			[name]:
				type === "checkbox"
					? checked
					: type === "number"
						? Number(value)
						: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await onUpdate(config);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
					URL do servidor Typebot
				</label>
				<input
					type="url"
					name="typebotUrl"
					value={config.typebotUrl}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-whatsapp-green focus:ring-whatsapp-green dark:bg-gray-700 dark:border-gray-600"
					placeholder="https://seu-typebot.com"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Nome do fluxo do tipobot
				</label>
				<input
					type="text"
					name="typebot"
					value={config.typebot}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-whatsapp-green focus:ring-whatsapp-green dark:bg-gray-700 dark:border-gray-600"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Tempo para expirar a sessão (segundos)
				</label>
				<input
					type="number"
					name="typebotExpire"
					value={config.typebotExpire}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-whatsapp-green focus:ring-whatsapp-green dark:bg-gray-700 dark:border-gray-600"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Palavra-chave para concluir o fluxo
				</label>
				<input
					type="text"
					name="typebotKeywordFinish"
					value={config.typebotKeywordFinish}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-whatsapp-green focus:ring-whatsapp-green dark:bg-gray-700 dark:border-gray-600"
					placeholder="sair"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Atraso padrão para as mensagens (ms)
				</label>
				<input
					type="number"
					name="typebotDelayMessage"
					value={config.typebotDelayMessage}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-whatsapp-green focus:ring-whatsapp-green dark:bg-gray-700 dark:border-gray-600"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Mensagem para comandos desconhecidos
				</label>
				<input
					type="text"
					name="typebotUnknownMessage"
					value={config.typebotUnknownMessage}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-whatsapp-green focus:ring-whatsapp-green dark:bg-gray-700 dark:border-gray-600"
				/>
			</div>

			<div className="flex items-center">
				<input
					type="checkbox"
					name="typebotListeningFromMe"
					checked={config.typebotListeningFromMe}
					onChange={handleChange}
					className="h-4 w-4 rounded border-gray-300 text-whatsapp-dark focus:ring-whatsapp-green"
				/>
				<label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
					O Typebot ouve mensagens enviadas pelo número conectado
				</label>
			</div>

			<button
				type="submit"
				className="w-full bg-whatsapp-green text-white px-4 py-2 rounded-md hover:bg-whatsapp-dark"
			>
				Salvar Configurações
			</button>
		</form>
	);
};

export default TypebotConfigForm;

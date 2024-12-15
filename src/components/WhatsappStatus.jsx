// src/components/WhatsappStatus.jsx
import React, { useEffect, useState } from "react";

const WhatsappStatus = () => {
	const [statuses, setStatuses] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchStatus = async () => {
		try {
			const response = await fetch("/api/status");
			const data = await response.json();
			setStatuses(data);
			setLoading(false);
		} catch (error) {
			console.error("Erro ao buscar status das instâncias:", error);
		}
	};

	const startConversation = async () => {
		try {
			await fetch("/api/start", { method: "POST" });
			alert("Conversa iniciada com sucesso!");
		} catch (error) {
			console.error("Erro ao iniciar conversa:", error);
		}
	};

	useEffect(() => {
		fetchStatus();
	}, []);

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold">Status das Instâncias do WhatsApp</h2>
			{loading ? (
				<p>Carregando status...</p>
			) : (
				<ul>
					{statuses.map((status, index) => (
						<li
							key={index}
							className={`p-2 ${status.connected ? "bg-green-200" : "bg-red-200"}`}
						>
							{status.instanceId}:{" "}
							{status.connected ? "Conectado" : "Desconectado"}
						</li>
					))}
				</ul>
			)}
			<button
				onClick={startConversation}
				className="mt-4 bg-blue-500 text-white p-2 rounded"
			>
				Iniciar Conversa
			</button>
		</div>
	);
};

export default WhatsappStatus;

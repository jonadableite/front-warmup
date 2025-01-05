import { motion } from "framer-motion";
import { useState } from "react";

const FAQItem = ({ question, answer }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="mb-4">
			<motion.div
				className="flex justify-between items-center cursor-pointer p-4 bg-whatsapp-cinza rounded-lg"
				onClick={() => setIsOpen(!isOpen)}
				whileHover={{ scale: 1.02 }}
				transition={{ duration: 0.2 }}
			>
				<h3 className="text-lg font-semibold">{question}</h3>
				<span className="text-xl">{isOpen ? "-" : "+"}</span>
			</motion.div>
			<motion.div
				initial={{ height: 0, opacity: 0 }}
				animate={{
					height: isOpen ? "auto" : 0,
					opacity: isOpen ? 1 : 0,
				}}
				transition={{ duration: 0.3 }}
				className="overflow-hidden bg-whatsapp-green/10 rounded-lg mt-2"
			>
				<p className="p-4">{answer}</p>
			</motion.div>
		</div>
	);
};

const TutorialPage = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-whatsapp-profundo to-black text-white p-8">
			<header className="text-center mb-10">
				<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-whatsapp-green to-whatsapp-light">
					Tutorial da WhatLead
				</h1>
				<p className="mt-2">Aprenda a usar nosso serviço de forma eficaz!</p>
			</header>

			<section className="mb-10">
				<h2 className="text-2xl font-semibold mb-4">Introdução</h2>
				<motion.p
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="bg-whatsapp-cinza p-4 rounded-lg"
				>
					Neste tutorial, você aprenderá como utilizar as principais
					funcionalidades do Warmer da WhatLead.
				</motion.p>
			</section>

			<section className="mb-10">
				<h2 className="text-2xl font-semibold mb-4">Funcionalidade 1</h2>
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					className="bg-whatsapp-cinza p-4 rounded-lg"
				>
					<p>Descrição da funcionalidade 1.</p>
					<video
						src="http://minioapp.whatlead.com.br/api/v1/download-shared-object/aHR0cHM6Ly9taW5pb2FwaS53aGF0bGVhZC5jb20uYnIvd2FybWVyL3R1dG9yaWFsLm1wND9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPTFHWkczMEoxNk1CSTlIVllFQ0FNJTJGMjAyNTAxMDUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMTA1VDIxMDc1NFomWC1BbXotRXhwaXJlcz00MzE5OSZYLUFtei1TZWN1cml0eS1Ub2tlbj1leUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaFkyTmxjM05MWlhraU9pSXhSMXBITXpCS01UWk5Ra2s1U0ZaWlJVTkJUU0lzSW1WNGNDSTZNVGN6TmpFMU16WTNOeXdpY0dGeVpXNTBJam9pWVdSdGFXNGlmUS5BMDZmVTgwX1FJcmFxOHJiaXdOUEJwdlpTU3BwMnBUWUFtTng4LUtqQ0hQWjU4Yk9DcU1YdkFZU1FBSW1sWHFUZkFYSk5ydWtfX2dFSjQ3QzVhNmhEQSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPTJhMjk1NDJiNjYyNWNjNDFkNTZhNTYzZWM5YzJkMDZiNGQ1ZGFmOTE5NmU3MjkwYjI4NjcxN2YwMDcyMzdhMGQ"
						controls
						className="w-full mt-2"
					/>
				</motion.div>
			</section>

			{/* <section className="mb-10">
				<h2 className="text-2xl font-semibold mb-4">Funcionalidade 2</h2>
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					className="bg-whatsapp-cinza p-4 rounded-lg"
				>
					<p>Descrição da funcionalidade 2.</p>
					<button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded">
						Experimente Agora
					</button>
				</motion.div>
			</section> */}

			<section className="mb-10">
				<h2 className="text-2xl font-semibold mb-4">FAQs</h2>
				<div className="bg-whatsapp-cinza p-4 rounded-lg">
					<FAQItem
						question="Como posso criar uma nova instância?"
						answer="Para criar uma nova instância, clique no botão 'Nova Instância' e preencha os detalhes necessários."
					/>
					<FAQItem
						question="O que fazer se a instância não conectar?"
						answer="Verifique se o QR Code foi escaneado corretamente e se a instância está ativa ou voce pode clicar no botão 'Conectar' para gerar novo QR Code e garantir a leitura correta do QR Code."
					/>
					<FAQItem
						question="Qual é o limite de mensagens no plano gratuito do aquecimento?"
						answer="No plano gratuito, você pode enviar até 20 mensagens por dia por instância e o aquecimento é interrompido automaticamente quando atingir este limite ja o fluxobot funciona ilimitado sem interrompimento."
					/>
					<FAQItem
						question="Como posso atualizar meu plano?"
						answer="Você pode atualizar seu plano acessando a seção de 'Gerenciar Plano' no menu ou procurar nosso suporte."
					/>
				</div>
			</section>

			<footer className="text-center mt-10">
				<p>Para mais informações, entre em contato com nosso suporte.</p>
			</footer>
		</div>
	);
};

export default TutorialPage;

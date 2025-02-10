import { motion } from "framer-motion";
import { useState } from "react";

const FaqItem = ({ question, answer }) => {
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
          <p className="mb-4">Descrição da funcionalidade 1.</p>
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            {" "}
            {/* 16:9 Aspect Ratio */}
            <iframe
              src="https://www.youtube.com/embed/Oomhu7H7pb8"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </motion.div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
        <div className="bg-whatsapp-cinza p-4 rounded-lg">
          <FaqItem
            question="Como posso criar uma nova instância?"
            answer="Para criar uma nova instância, clique no botão 'Nova Instância' e preencha os detalhes necessários."
          />
          <FaqItem
            question="O que fazer se a instância não conectar?"
            answer="Verifique se o QR Code foi escaneado corretamente e se a instância está ativa ou você pode clicar no botão 'Conectar' para gerar novo QR Code e garantir a leitura correta do QR Code."
          />
          <FaqItem
            question="Qual é o limite de mensagens no plano gratuito do aquecimento?"
            answer="No plano gratuito, você pode enviar até 20 mensagens por dia por instância e o aquecimento é interrompido automaticamente quando atingir este limite. Já o fluxobot funciona ilimitado sem interrompimento."
          />
          <FaqItem
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

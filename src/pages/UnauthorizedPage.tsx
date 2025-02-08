// src/pages/UnauthorizedPage.tsx
import type React from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-whatsapp-profundo via-whatsapp-profundo to-whatsapp-profundo p-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Acesso Não Autorizado
        </h1>
        <p className="text-gray-300 mb-8">
          Você não tem permissão para acessar esta página.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-whatsapp-green text-white px-6 py-2 rounded-md hover:bg-whatsapp-green/80 transition"
        >
          Voltar para Home
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

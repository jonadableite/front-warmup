// src/utils/auth.ts

import type { DecodedToken } from "../interface/index";

// Função de decodificação JWT
function decodeJwt(token: string): DecodedToken | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
}

// Outras funções de autenticação
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getUserRole = (): string | null => {
  const token = getToken();
  if (!token) {
    console.log("Nenhum token encontrado");
    return null;
  }

  const decoded = decodeJwt(token);
  if (!decoded) {
    console.log("Falha ao decodificar o token");
    return null;
  }

  console.log("Token decodificado completo:", decoded);
  const role = decoded.role || decoded.profile;
  console.log("Role/Profile extraído do token:", role);
  return role || null;
};

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!getToken();
};

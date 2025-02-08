// src/hooks/useAuth.ts

import { useEffect, useState } from "react";
import axios from "../axiosConfig";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/users/me");
        setUser(response.data);
        setError(null);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        setError("Falha ao carregar informações do usuário");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

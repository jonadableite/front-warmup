// src/hooks/useAffiliateDashboard.ts
import { useEffect, useState } from "react";
import axios from "../axiosConfig";

export const useAffiliateDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(
          "https://aquecerapi.whatlead.com.br/api/affiliates/dashboard",
        );
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dashboard:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Erro ao carregar dados",
        );
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { data, loading, error };
};

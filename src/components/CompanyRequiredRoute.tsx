// src/components/CompanyRequiredRoute.tsx
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import { API_BASE_URL } from "../config";

interface CompanyRequiredRouteProps {
	children: React.ReactNode;
}

const CompanyRequiredRoute: React.FC<CompanyRequiredRouteProps> = ({
	children,
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const [hasCompanySetup, setHasCompanySetup] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const checkCompanyStatus = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					navigate("/login");
					return;
				}

				const response = await axios.get(
					`${API_BASE_URL}/api/users/company/status`,
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				);

				if (response.data.isTemporaryCompany) {
					navigate("/company-setup");
				} else {
					setHasCompanySetup(true);
				}
			} catch (error) {
				console.error("Erro ao verificar status da empresa:", error);
				navigate("/login");
			} finally {
				setIsLoading(false);
			}
		};

		checkCompanyStatus();
	}, [navigate]);

	if (isLoading) {
		return <div>Carregando...</div>;
	}

	return hasCompanySetup ? <>{children}</> : null;
};

export default CompanyRequiredRoute;

import { useDarkMode } from "@/hooks/useDarkMode";
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import CompanyRequiredRoute from "./components/CompanyRequiredRoute";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "./components/ui/sidebar";
import AccountInfoPage from "./pages/AccountInfoPage";
import Aquecimento from "./pages/Aquecimento";
import CheckoutPage from "./pages/CheckoutPage";
import CompanySetup from "./pages/CompanySetup";
import Configuracoes from "./pages/Configuracoes";
import FileUpload from "./pages/FileUpload";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Numeros from "./pages/Numeros";
import PaymentSuccess from "./pages/PaymentSuccess";
import PricingPage from "./pages/Pricing";
import Register from "./pages/Register";
import Return from "./pages/Return";
import TutorialPage from "./pages/TutorialPage";

function App() {
	const [isDarkMode] = useDarkMode();

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [isDarkMode]);

	return (
		<SidebarProvider>
			<AppContent />
		</SidebarProvider>
	);
}

function AppContent() {
	const location = useLocation();
	const { open } = useSidebar();

	const isPublicRoute =
		location.pathname === "/login" ||
		location.pathname === "/register" ||
		location.pathname === "/forgot-password" ||
		location.pathname === "/company-setup" ||
		location.pathname === "/pricing" ||
		location.pathname === "/checkout" ||
		location.pathname === "/return";

	return (
		<div className="flex min-h-screen">
			{!isPublicRoute && <Sidebar />}
			<div className="flex-1 flex flex-col transition-all duration-300">
				{!isPublicRoute && <Header isSidebarOpen={open} />}
				<main className={`${!isPublicRoute ? "pt-16" : ""}`}>
					<Routes>
						{/* Rotas públicas */}
						<Route
							path="/login"
							element={
								<PublicRoute>
									<Login />
								</PublicRoute>
							}
						/>
						<Route
							path="/register"
							element={
								<PublicRoute>
									<Register />
								</PublicRoute>
							}
						/>
						<Route
							path="/forgot-password"
							element={
								<PublicRoute>
									<ForgotPassword />
								</PublicRoute>
							}
						/>
						<Route path="/pricing" element={<PricingPage />} />
						<Route path="/checkout" element={<CheckoutPage />} />
						<Route path="/return" element={<Return />} />

						{/* Rota de configuração da empresa - requer apenas autenticação */}
						<Route
							path="/company-setup"
							element={
								<PrivateRoute>
									<CompanySetup />
								</PrivateRoute>
							}
						/>

						{/* Rotas que requerem autenticação e empresa configurada */}
						<Route
							path="/"
							element={
								<PrivateRoute>
									<CompanyRequiredRoute>
										<Home />
									</CompanyRequiredRoute>
								</PrivateRoute>
							}
						/>
						<Route
							path="/numeros"
							element={
								<PrivateRoute>
									<CompanyRequiredRoute>
										<Numeros />
									</CompanyRequiredRoute>
								</PrivateRoute>
							}
						/>
						<Route
							path="/upload"
							element={
								<PrivateRoute>
									<CompanyRequiredRoute>
										<FileUpload />
									</CompanyRequiredRoute>
								</PrivateRoute>
							}
						/>
						<Route
							path="/tutorial"
							element={
								<PrivateRoute>
									<CompanyRequiredRoute>
										<TutorialPage />
									</CompanyRequiredRoute>
								</PrivateRoute>
							}
						/>
						<Route
							path="/payment-success"
							element={
								<PrivateRoute>
									<CompanyRequiredRoute>
										<PaymentSuccess />
									</CompanyRequiredRoute>
								</PrivateRoute>
							}
						/>
						<Route
							path="/aquecimento"
							element={
								<PrivateRoute>
									<CompanyRequiredRoute>
										<Aquecimento />
									</CompanyRequiredRoute>
								</PrivateRoute>
							}
						/>
						<Route
							path="/configuracoes"
							element={
								<PrivateRoute>
									<CompanyRequiredRoute>
										<Configuracoes />
									</CompanyRequiredRoute>
								</PrivateRoute>
							}
						/>
						<Route
							path="/account-info"
							element={
								<PrivateRoute>
									<CompanyRequiredRoute>
										<AccountInfoPage />
									</CompanyRequiredRoute>
								</PrivateRoute>
							}
						/>
					</Routes>
				</main>
			</div>
		</div>
	);
}

export default App;

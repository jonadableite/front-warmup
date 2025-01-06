import { useDarkMode } from "@/hooks/useDarkMode";
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "./components/ui/sidebar";
import Aquecimento from "./pages/Aquecimento";
import CheckoutPage from "./pages/CheckoutPage";
import Configuracoes from "./pages/Configuracoes";
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
		location.pathname === "/forgot-password";

	return (
		<div className="flex min-h-screen">
			{!isPublicRoute && <Sidebar />}
			<div className="flex-1 flex flex-col transition-all duration-300">
				{!isPublicRoute && <Header isSidebarOpen={open} />}
				<main className={`${!isPublicRoute ? "pt-16" : ""}`}>
					<Routes>
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
						<Route path="/pricing" element={<PricingPage />} />
						<Route
							path="/forgot-password"
							element={
								<PublicRoute>
									<ForgotPassword />
								</PublicRoute>
							}
						/>
						<Route
							path="/"
							element={
								<PrivateRoute>
									<Home />
								</PrivateRoute>
							}
						/>
						<Route
							path="/numeros"
							element={
								<PrivateRoute>
									<Numeros />
								</PrivateRoute>
							}
						/>
						<Route
							path="/tutorial"
							element={
								<PrivateRoute>
									<TutorialPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="/payment-success"
							element={
								<PrivateRoute>
									<PaymentSuccess />
								</PrivateRoute>
							}
						/>
						<Route
							path="/aquecimento"
							element={
								<PrivateRoute>
									<Aquecimento />
								</PrivateRoute>
							}
						/>
						<Route
							path="/configuracoes"
							element={
								<PrivateRoute>
									<Configuracoes />
								</PrivateRoute>
							}
						/>
						<Route path="/checkout" element={<CheckoutPage />} />
						<Route path="/return" element={<Return />} />
					</Routes>
				</main>
			</div>
		</div>
	);
}

export default App;

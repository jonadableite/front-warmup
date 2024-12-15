import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Aquecimento from "./pages/Aquecimento";
import Configuracoes from "./pages/Configuracoes";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Numeros from "./pages/Numeros"; // Certifique-se de que esta linha está presente

function App() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const location = useLocation();

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const isLoginRoute = location.pathname === "/login";

	return (
		<div className="flex min-h-screen">
			{!isLoginRoute && (
				<Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
			)}
			<div
				className={`flex-1 flex flex-col transition-all duration-300 ${
					!isLoginRoute && isSidebarOpen ? "ml-64" : "ml-0"
				}`}
			>
				{!isLoginRoute && <Header />}
				<main className={`${!isLoginRoute ? "pt-16" : ""}`}>
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
					</Routes>
				</main>
			</div>
		</div>
	);
}

export default App;

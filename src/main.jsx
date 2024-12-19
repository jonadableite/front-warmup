// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<React.StrictMode>
			<Router>
				<App />
			</Router>
		</React.StrictMode>,
	);
} else {
	console.error("Elemento root não encontrado");
}

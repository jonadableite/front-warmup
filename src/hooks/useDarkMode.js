// src/hooks/useDarkMode.ts
import { useEffect, useState } from "react";

export function useDarkMode() {
	// Sempre retorna true para isDarkMode
	const [isDarkMode] = useState(true);

	useEffect(() => {
		// Sempre adiciona a classe dark
		document.documentElement.classList.add("dark");
		localStorage.setItem("dark-mode", "true");
	}, []);

	// Retorna apenas o estado, sem a função de alteração
	return [isDarkMode];
}

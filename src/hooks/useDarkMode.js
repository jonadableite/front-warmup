// src/hooks/useDarkMode.js
import { useEffect, useState } from "react";

export function useDarkMode() {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const savedMode = localStorage.getItem("dark-mode");
		return savedMode ? JSON.parse(savedMode) : false;
	});

	useEffect(() => {
		const className = "dark";
		const bodyClass = window.document.documentElement.classList;

		if (isDarkMode) {
			bodyClass.add(className);
		} else {
			bodyClass.remove(className);
		}

		localStorage.setItem("dark-mode", JSON.stringify(isDarkMode));
	}, [isDarkMode]);

	return [isDarkMode, setIsDarkMode];
}

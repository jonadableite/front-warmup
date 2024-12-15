import MoonIcon from "@/assets/lua-e-estrelas.svg";
import { useDarkMode } from "@/hooks/useDarkMode";
import React from "react";

const Header = () => {
	const [isDarkMode, setIsDarkMode] = useDarkMode();

	const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

	return (
		<header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 shadow-md flex justify-end items-center px-6 z-10">
			<label className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
				<input
					type="checkbox"
					checked={isDarkMode}
					onChange={toggleDarkMode}
					className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
				/>
				<span className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer">
					<img
						src={MoonIcon}
						alt="Modo Escuro"
						className="absolute left-0 top-0 w-6 h-6"
					/>
				</span>
			</label>
			<style>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #4caf50;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #4caf50;
        }
      `}</style>
		</header>
	);
};

export default Header;

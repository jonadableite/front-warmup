// tailwind.config.js
module.exports = {
	darkMode: "class", // Usar 'class' para habilitar o dark mode
	content: [
		"./src/pages/**/*.{js,jsx}",
		"./src/components/**/*.{js,jsx}",
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				whatsapp: {
					green: "#00FF6A",
					dark: "#128C7E",
					light: "#DCF8C6",
					cinza: "#1B1B1F",
					eletrico: "#7D00FF",
					luminoso: "#00E5FF",
					profundo: "#0D0D0D",
					branco: "#F0F0F5",
					prata: "#535353",
					cinzaClaro: "#B3B3B3",
				},
			},

			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};

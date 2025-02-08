// tailwind.config.js
module.exports = {
  darkMode: "class",
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
          green: "#4f47e6",
          dark: "#2e87c7",
          light: "#DCF8C6",
          cinza: "#0e0d12",
          eletrico: "#7D00FF",
          luminoso: "#00E5FF",
          profundo: "#0D0D0D",
          branco: "#F0F0F5",
          prata: "#535353",
          cinzaClaro: "#B3B3B3",
        },
        // Adicionando cores para os botões
        primary: {
          DEFAULT: "#4f47e6", // Verde do WhatsApp para botões primários
          foreground: "#FFFFFF", // Texto branco para contraste
        },
        secondary: {
          DEFAULT: "#7D00FF", // Verde escuro do WhatsApp para botões secundários
          foreground: "#FFFFFF", // Texto branco para contraste
        },
        destructive: {
          DEFAULT: "#FF4136", // Vermelho para botões de ação destrutiva
          foreground: "#FFFFFF", // Texto branco para contraste
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

import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        black: "#000000", 
        maroon: "#3D0000", 
        darkred: "#950101", 
        red: "#FF0000"
        
      },
    },
    backgroundImage: {
      'animated-gradient': `linear-gradient(to right,#000000  0%, #3D0000 50%, #950101 100%)`,
    },
  },
  plugins: [],
} satisfies Config;

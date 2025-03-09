/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        'custom-purple': '#4D077C',
        'primary-color': '#9800FF',
        'secondary-color': '#262626',
        "primary-color": "var(--primary-color)",
        "secondary-color": "var(--secondary-color)"
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(90deg, #FFFFFF, #FFFFFF, #F0B6D0, #F0B6D0,#4D077C)',
      },
      textShadow: {
        'text-shadow1': '2px 2px 4px rgba(0, 0, 0, 0.3)', 
      },
      dropShadow: {
        'custom': '4px 4px 10px rgba(0, 0, 0, 0.5)', 
        'customWhite': '4px 4px 10px rgba(255, 255, 255, 0.5)', 
        'customViolet': '4px 4px 15px rgba(138, 43, 226, 1)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [require("daisyui")],  
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#6366f1",
          "secondary": "#9333ea",
          "accent": "#c084fc",
          "neutral": "#2a323c",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
}


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
        'gradient-custom': 'linear-gradient(to right, #FFFFFF, #F0B6D0, #4D077C)',
      },
      textShadow: {
        'text-shadow1': '2px 2px 4px rgba(0, 0, 0, 0.3)', 
      },
      dropShadow: {
        'custom': '4px 4px 10px rgba(0, 0, 0, 0.5)', 
      },
      
      
      
    },
  },
  plugins: [require("daisyui")],  
}


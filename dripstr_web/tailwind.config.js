/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        'custom-purple': '#4D077C',
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(to right, #FFFFFF, #F0B6D0, #4D077C)',
      },
    },
  },
  plugins: [require("daisyui")],  
}


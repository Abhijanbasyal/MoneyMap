/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-light': '#328E6E',   
        'secondary-light': '#67AE6E', 
        'accent-light': '#90C67C',    
        'background-light': '#E1EEBC', 

        'primary-dark': '#362222',
        'secondary-dark': '#171010',  
        'accent-dark': '#423F3E',     
        'background-dark': '#2B2B2B', 
      },
    },
  },
  plugins: [],
  presets: [require('nativewind/preset')],
};

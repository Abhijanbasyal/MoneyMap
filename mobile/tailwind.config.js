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

        'primary-dark': '#373640',
        'secondary-dark': '#63686E',  
        'accent-dark': '#7E97A6',     
        'background-dark': '#B6F7C1', 
      },
    },
  },
  plugins: [],
  presets: [require('nativewind/preset')],
};

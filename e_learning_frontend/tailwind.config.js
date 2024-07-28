/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Adjust the paths according to your project structure
  ],
  theme: {
    extend: {
      colors: {
        'background-blue': '#ADD8E6',
        'logo-blue': '#336699',
        'hover-blue': '#03045e',
        'sky-blue':'#cfecf7',
        'dark-blue':'#00239c',
        'logo-yellow': "#FC3"
      },
      borderRadius: {
        '3xl': '1.5rem', // Customize as needed
      },
      boxShadow: {
        '3xl': '0 10px 30px rgba(0, 0, 0, 0.25)', // Customize as needed
      },
    },
  },
  plugins: [],
};


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
        'light-blue':'#bbd0ff',
        'dark-blue':'#00239c',
        'word-orange':'#e85d04',
        'logo-yellow': "#FC3",
        'light-yellow':'#eaf2d7',
        'light-yellow-hover': '#d4e1b5',
        'light-green': '#d0f4de',
        'dark-green':'#38b000',
        'more-dark-green':'#007200',  
        'sky-blue': '#a9def9'
      },
      borderColor: {
        'custom-yellow': '#eaf2d7',
        'custom-yellow-hover': '#d4e1b5',
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

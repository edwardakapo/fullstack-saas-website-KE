/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors : {
        'background-lite' : '#f5f5f4' ,
        'background-dark' : '#0c0a09',
        'hover-blue' : '#0ea5e9',
        'hover-gray' : '#e5e7eb',
        'Button-toggle-blue' : '#1d4ed8',

      },
    },
  },
  plugins: [],
}


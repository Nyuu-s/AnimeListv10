module.exports = {
  purge: [],
  content: [
    './src/Components/**/*.{js,ts,jsx,tsx}',
    './src/Components/Helpers/**/*.{js,ts,jsx,tsx}',
    './src/context/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {

    extend: {
      cursor: {
        'col-resize': 'col-resize',
        'ew-resize': 'ew-resize'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  variants: {
    extend: {
      
    },
  },
  plugins: [],
}

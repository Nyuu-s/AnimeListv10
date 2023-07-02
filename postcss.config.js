module.exports = {
  plugins: {
    tailwindcss: {config: './tailwindcss-config.js'},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  },
}

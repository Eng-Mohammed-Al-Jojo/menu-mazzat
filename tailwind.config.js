// tailwind.config.js
module.exports = {
    darkMode: false, // الآن أي `dark:` لن يعمل ولن يتأثر المتصفح
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
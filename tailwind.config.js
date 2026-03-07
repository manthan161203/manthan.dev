/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#050813',
                surface: 'rgba(255, 255, 255, 0.06)',
                surfaceHover: 'rgba(255, 255, 255, 0.1)',
                border: 'rgba(255, 255, 255, 0.16)',
                primary: '#f8f6f1',
                secondary: '#aeb9cf',
                muted: '#6f7f9f',
                accent: '#64f5d2',
            },
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
                title: ['Bricolage Grotesque', 'Manrope', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}

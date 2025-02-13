/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		fontFamily: {
			sans: ["Geist", "Noto Sans JP", "sans-serif"],
			mono: ["Geist Mono", "monospace"],
		},
		extend: {
			brightness: {
				25: ".25",
			},
			colors: {
				cumulodark: "#1d3744",
				cumulolight: "#165b7a",
				inactive: "#e4e4e7",
				active: "#ffffff",
			},
			transitionTimingFunction: {
				"in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
				"out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
};

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	darkMode: "class",
	theme: {
		fontFamily: {
			head: ["Montserrat", `"M PLUS 1p"`, "sans-serif"],
			sans: ["Inter", `"M PLUS 1p"`, "sans-serif"],
			mono: ["Azeret Mono", "monospace"],
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
};

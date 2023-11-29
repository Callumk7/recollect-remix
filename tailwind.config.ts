import type { Config } from "tailwindcss";
import { mauve, ruby, cyan, mint, blackA, whiteA } from "@radix-ui/colors";

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				...mauve,
				...ruby,
				...cyan,
				...mint,
				...blackA,
				...whiteA,
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		require("tailwindcss-react-aria-components"),
		require("@tailwindcss/typography"),
	],
} satisfies Config;

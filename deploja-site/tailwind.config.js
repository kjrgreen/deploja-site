/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
      notoSerif: ["Noto Serif", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      baltic: {
        DEFAULT: "#22252a",
      },
      mint: {
        DEFAULT: "#30c09d",
      },
      wedgewood: {
        DEFAULT: "#488995",
      },
    },
  },
  plugins: [require("daisyui")],
  corePlugins: {
    preflight: true,
  },
  daisyui: {
    themes: [
      {
        deploja: {
          //White
          primary: "#FFFFFF",
          //Wedgewood
          secondary: "#488995",
          //Baltic
          neutral: "#22252a",
          //mint
          accent: "#30c09d",

          "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes. Default: "1rem"
          "--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element. Default: 0.5rem
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar. Default: 1.9rem
          "--tab-radius": "0.5rem", // border radius of tabs. Default: 0.5rem
          "--btn-text-case": "none", // set default text transform for buttons
          "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
        },
      },
    ],
  },
};

//colors:
/*      pinetree: {
  DEFAULT: "#2D2926",
  medium: "#575451",
  soft: "#817F7D",
  pale: "#ABA9A8",
  paler: "#D5D4D4",
  palest: "#EAEAEA",
},
white: {
  DEFAULT: "#FFFFFF",
  medium: "#E5E5E5",
  soft: "#E1E1E1",
  pale: "#EFEFEF",
  paler: "#EAEAEA",
  palest: "#F2F2F2",
},*/

//theme:
/*        deploja: {
  primary: "#FFFFFF", //White
  secondary: "#2D2926", //Pine Tree
  accent: "#001f27", //From palette, 6
  neutral: "#59524c", //From palette, 8
  "base-100": "#2D2926", //Pine Tree
  info: "#809fa7", //From palette, 3
  success: "#71a6aa", //From palette, 2
  warning: "#d5b47f", //From palette, 5
  error: "#d94038", //From palette, 7
},*/

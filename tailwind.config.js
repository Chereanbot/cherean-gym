/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        transparent: "transparent",
        black: {
          900 : "#000000",
          500: "#4F5665",
          600: "#0B132A",
        },
        orange: {
          100: "#FFECEC",
          500: "#F53855",
        },
        green: {
          500: "#2FAB73",
          main : "#0DB760"
        },
        white: {
          300: "#F8F8F8",
          500: "#fff",
        },
        gray: {
          100: "#EEEFF2",
          400: "#AFB5C0",
          500: "#DDDDDD",
        },
      },
      animation: {
        'pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '0.05' },
          '50%': { opacity: '0.1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      boxShadow: {
        'glow': '0 0 15px rgba(13, 183, 96, 0.5)',
        'glow-lg': '0 0 30px rgba(13, 183, 96, 0.6)',
      },
    },
    variants: {
      extend: {
        boxShadow: ["active", "hover"],
        scale: ["active", "hover"],
        transform: ["hover", "focus"],
      },
    },
  },
  plugins: [],

};

/* eslint-disable @typescript-eslint/no-explicit-any */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Cairo"', 'sans-serif', 'system-ui'], // خط عربي جميل + fallback
      },
    },
  },
  plugins: [
    // إضافة دعم RTL/LTR يدويًا لأن Tailwind v4 مش بيجيب plugin جاهز زي الأول
    function ({ addVariant }: any) {
      addVariant("rtl", '[dir="rtl"] &');
      addVariant("ltr", '[dir="ltr"] &');
    },
  ],
} satisfies import('tailwindcss').Config;
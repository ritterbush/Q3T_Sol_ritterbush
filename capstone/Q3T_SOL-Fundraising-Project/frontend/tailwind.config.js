/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        blk_graet_bg:"linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 100%)",
        blkGradient: "linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 100%)",
        graidnt_bg:"linear-gradient(to top right, #d5888c, #fdfafa 23%, #fdfafa 100%, #85365f);",
        transparent_bg: "linear-gradient(220deg,#FFC20008 , #d5888c, #d5888c)",

        color_gradient: "linear-gradient(rgba(200, 70, 87, 0.3), rgba(133, 54, 95, 0.8))",
        progress_bar:"linear-gradient(to right, #fff 40%, transparent 40%);",

      },
      colors:{
        "primary_color":"#85365f",
        "secondary_color":"#ECCE8E",
        "hover":"#d5888c"
      },
       boxShadow: {
        "form_shadow": "-5px 20px 24px -4px #2b353914,0 8px 8px -4px #2b35390a",
        light_shadow:"0px 0px 6px 4px rgba(219, 218, 218, 0.308)"
      },
    },
  },
  plugins: [],
}
  
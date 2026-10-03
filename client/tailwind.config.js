export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        petal:  { 50:"#FFF5F9",100:"#FEF0F5",200:"#F9D6E8" },
        tulip:  { 300:"#F4A0C8",400:"#E87CB0",500:"#D4649A",600:"#B84A82" },
        lotus:  { 300:"#C8A0DC",400:"#B07EC8",500:"#9B4FA0",600:"#7B358A" },
        stem:   { 400:"#6BA872",500:"#5A8A62",600:"#4A7252" },
        rose:   { 300:"#F0C0D0",400:"#E8809A",500:"#D45A78" },
      },
      fontFamily: {
        display:     ["Playfair Display","Georgia","serif"],
        body:        ["Poppins","system-ui","sans-serif"],
        handwritten: ["Caveat","cursive"],
      },
      animation: {
        float:   "float 6s ease-in-out infinite",
        twinkle: "twinkle 2s ease-in-out infinite",
        sway:    "sway 4s ease-in-out infinite",
        rise:    "rise 12s linear infinite",
      },
      keyframes: {
        float:   {"0%,100%":{transform:"translateY(0)"},"50%":{transform:"translateY(-12px)"}},
        twinkle: {"0%,100%":{opacity:".2",transform:"scale(.8)"},"50%":{opacity:"1",transform:"scale(1.4)"}},
        sway:    {"0%,100%":{transform:"rotate(-2.5deg)"},"50%":{transform:"rotate(2.5deg)"}},
        rise:    {from:{transform:"translateY(110vh)",opacity:"0"},"10%":{opacity:".7"},"90%":{opacity:".3"},to:{transform:"translateY(-10vh)",opacity:"0"}},
      },
    },
  },
  plugins:[],
};

// Optional Tailwind preset — lets you write bg-primary, text-fg, rounded-token-md, etc.
// The components in this folder DON'T require it (they reference the CSS variables in
// tokens.css directly), so you can adopt it just for your own app code, or skip it.
//
//   // tailwind.config.js
//   module.exports = {
//     presets: [require("./src/design-system/tailwind.preset.js")],
//     content: ["./src/**/*.{ts,tsx,html}"],
//   };
//
// Values resolve to the CSS variables, so Day/Night theming still comes from tokens.css.

const v = (name) => `var(--${name})`;

module.exports = {
  theme: {
    extend: {
      colors: {
        bg: v("bg"),
        surface: v("surface"),
        panel: v("panel"),
        fg: v("text"),
        muted: v("text-soft"),
        line: v("line"),
        "line-strong": v("line-strong"),
        cream: v("cream"),
        ink: v("ink"),
        teal: v("teal"),
        leaf: v("leaf"),
        marigold: v("marigold"),
        tomato: v("tomato"),
        denim: v("denim"),
        raspberry: v("raspberry"),
        oat: v("oat"),
        danger: v("danger"),
        primary: v("primary"),
        secondary: v("secondary"),
        accent: v("accent"),
        hot: v("hot"),
        info: v("info"),
        play: v("play"),
        "on-primary": v("on-primary"),
        "on-secondary": v("on-secondary"),
        "on-accent": v("on-accent"),
        "on-info": v("on-info"),
        "on-hot": v("on-hot"),
        "on-play": v("on-play"),
        "on-danger": v("on-danger"),
        "on-ink": v("on-ink"),
      },
      fontFamily: {
        display: ["Archivo", "system-ui", "sans-serif"],
        sans: ['"Atkinson Hyperlegible Next"', '"Atkinson Hyperlegible"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        "token-sm": v("radius-sm"),
        "token-md": v("radius-md"),
        "token-lg": v("radius-lg"),
        pill: v("radius-pill"),
      },
      boxShadow: {
        card: v("shadow-card"),
      },
      spacing: {
        "token-1": v("space-1"),
        "token-2": v("space-2"),
        "token-3": v("space-3"),
        "token-4": v("space-4"),
        "token-5": v("space-5"),
        "token-6": v("space-6"),
        "token-8": v("space-8"),
        "token-12": v("space-12"),
      },
    },
  },
};

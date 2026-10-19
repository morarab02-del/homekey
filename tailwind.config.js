/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          main: "#FDFBF7",
          card: "#FFFFFF",
          subtle: "#FAF7F2",
        },
        ink: {
          primary: "#1A1612",
          muted: "#6E675F",
          subtle: "#81796F",
        },
        sand: {
          border: "#E5DFD5",
          hover: "#C2B8A8",
        },
        brass: {
          accent: "#A77C31",
          light: "#F4EFE6",
        },
        cream: { 50: "#FBF8F3", 100: "#F7F1E8", 200: "#F0E7DA" },
        sand: { 50: "#F3EDE3", 100: "#E9DFCF" },
        oat: { 50: "#EDE4D8" },
        walnut: { 900: "#3A2418", 700: "#5C3D26", 500: "#7A4F33", 300: "#A9825B" },
        brass: { 50: "#FBF6EC", 100: "#F5EAD6", 200: "#EAD9A6", 300: "#D4B878", 400: "#B08D57", 500: "#9A7A42", 600: "#7A6038", 700: "#5C4A2E" },
        brand: { 50: "#FBF6EC", 100: "#F5EAD6", 200: "#EAD9A6", 300: "#D4B878", 400: "#B08D57", 500: "#A77C31", 600: "#7A6038", 700: "#5C4A2E", 800: "#3A2A1C", 900: "#241810" },
        ok: { 50: "#F0FDF4", 100: "#DCFCE7", 200: "#BBF7D0", 600: "#16A34A", 700: "#15803D" },
        soon: { 50: "#FFFBEB", 100: "#FEF3C7", 200: "#FDE68A", 600: "#D97706", 700: "#B45309" },
        muted: { 50: "#F7F3EC", 100: "#F0E7DA", 200: "#E2D8C8", 300: "#C9BBA8", 500: "#8A7E70", 600: "#6B635B", 700: "#4A443C" },
        ink: { 900: "#1A1612", 700: "#4A443C", 600: "#6B635B", 200: "#E2D8C8", 100: "#F0E7DA" },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "system-ui", "sans-serif"],
      },
      borderRadius: { xl2: "1.25rem", xl3: "1.75rem", xl4: "2rem" },
      boxShadow: {
        card: "0 1px 3px rgba(26,22,18,.05), 0 8px 24px rgba(26,22,18,.06)",
        lift: "0 4px 12px rgba(26,22,18,.08), 0 18px 44px rgba(26,22,18,.10)",
        pop: "0 12px 40px rgba(26,22,18,.14)",
        glass: "0 8px 32px rgba(26,22,18,.10), 0 2px 6px rgba(26,22,18,.06)",
      },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "spin-slow": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
        "pulse-ring": { "0%, 100%": { opacity: "1" }, "50%": { opacity: ".55" } },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        "fade-up": "fade-up .35s ease-out both",
        "spin-slow": "spin-slow 18s linear infinite",
        "pulse-ring": "pulse-ring 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
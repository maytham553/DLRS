import { createSystem, defineConfig } from "@chakra-ui/react";

// Define custom colors for the theme
const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#EBF8FF" },
          100: { value: "#BEE3F8" },
          200: { value: "#90CDF4" },
          300: { value: "#63B3ED" },
          400: { value: "#4299E1" },
          500: { value: "#9FB3DF" }, // primary brand color
          600: { value: "#2B6CB0" },
          700: { value: "#2C5282" },
          800: { value: "#2A4365" },
          900: { value: "#1A365D" },
        },
        accent: {
          500: { value: "#ED64A6" }, // accent color for highlights
        },
      },
    },
    semanticTokens: {
      colors: {
        "bg.canvas": {
          value: "white", // Base background color
        },
        "bg.subtle": {
          value: "gray.50", // Subtle background for cards
        },
        "text.primary": {
          value: "gray.900",
        },
        "text.secondary": {
          value: "gray.600",
        },
      },
    },
  },
  cssVarsPrefix: "dlrs",
});

// Create the system
export const system = createSystem(customConfig);

// Export default system for convenience
export default system;

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(), 
        // @ts-ignore
        tailwindcss({
            config: './tailwind.config.js',
            // Add explicit options to avoid using oklch color functions
            tailwindcss: {
                cssVarsPrefix: '', // Use raw CSS variables without prefix
                theme: {
                    colors: {
                        inherit: 'inherit',
                        current: 'currentColor',
                        transparent: 'transparent',
                    }
                }
            }
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    css: {
        transformer: 'postcss', // Explicitly set the CSS transformer
        devSourcemap: true, // Enable source maps for easier debugging
    }
});

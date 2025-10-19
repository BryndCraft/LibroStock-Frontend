import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      theme: {
        extend: {
          fontFamily: {
            montserratBold: ['Montserrat', 'sans-serif'],
            poppins: ['Poppins', 'sans-serif'],
          },
        },
      },
    }),
  ],
});

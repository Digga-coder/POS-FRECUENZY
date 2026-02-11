import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Esto permite ver la web desde fuera si es necesario
    port: 3000,
  },
  base: './',
});
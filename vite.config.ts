import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PWA é feito à mão (manifest + sw.js em /public), sem plugin, pra evitar dor de cabeça de versão.
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
});

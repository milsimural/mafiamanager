import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Получение переменных окружения из системы
const appIp = process.env.APP_IP || '127.0.0.1';
const appPort = process.env.APP_PORT || '3000';
const isSecure = process.env.ISSECURE === 'true'; // Проверяем, что переменная равна 'true'

// Устанавливаем протокол на основе значения isSecure
const protocol = isSecure ? 'https' : 'http';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: `${protocol}://${appIp}:${appPort}`,
        changeOrigin: true,
        secure: isSecure, // Здесь можно использовать значение isSecure
      },
    },
  },
  resolve: {
    alias: {
      src: "/src",
    },
  },
  define: {
    'process.env.APP_IP': JSON.stringify(appIp),
    'process.env.APP_PORT': JSON.stringify(appPort),
    'process.env.ISSECURE': JSON.stringify(isSecure),
  },
  build: {
    outDir: "../server/dist",
  },
});

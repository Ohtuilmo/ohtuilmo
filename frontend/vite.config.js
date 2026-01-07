import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());

  const BACKEND_URL = `${env.VITE_BACKEND_URL || 'http://backend:3001'}`;
  const PORT = `${env.VITE_PORT || '3000'}`;

  if (command === 'serve') { // when running dev server
    return {
      base: '/',
      server: {
        host: true,
        port: PORT,
        proxy: {
          '/api': {
            target: BACKEND_URL,
            changeOrigin: true,
          },
        },
      },
      plugins: [react(), reactRefresh()],
      define: {
        global: 'window'
      },
    }
  } else { // when building app
    return {
      base: '/projekti/',
      define: {
        global: 'window'
      },
    }
  }
})

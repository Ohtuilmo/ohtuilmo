import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig(({ command }) => {
  if (command === 'serve') { // when running dev server
    return {
      base: '/',
      server: {
        host: true,
        port: 3000,
        proxy: {
          '/api': {
            target: 'http://backend:3001',
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

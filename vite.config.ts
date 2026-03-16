import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Mude "lavanderia-app" para o nome do seu repositório no GitHub
  base: '/lavanderia-app/',
})

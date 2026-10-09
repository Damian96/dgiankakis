import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    base: '/',
    build: {
        outDir: 'docs',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                fullaroPrivacy: resolve(__dirname, 'fullaro/privacy-policy.html'),
            },
        },
    },
})
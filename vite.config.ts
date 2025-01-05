import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';

export default defineConfig(({ command, mode }) => {
    return {
        clearScreen: false,
        plugins: [
            vue({
                script: {
                    defineModel: true
                }
            }),
            AutoImport({
                resolvers: [VantResolver()]
            }),
            Components({
                resolvers: [VantResolver()]
            })
        ],
        resolve: {
            alias: {
                '@': path.resolve('Src')
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler'
                }
            }
        },
        esbuild: {
            drop: command === 'serve' ? [] : ['console', 'debugger']
        },
        build: {
            target: ['esnext'],
            minify: 'esbuild',
            sourcemap: false,
            emptyOutDir: true,
            assetsDir: 'Source',
            outDir: path.join(__dirname, 'Dist'),
            rollupOptions: {
                output: {
                    manualChunks: (id: string) => {
                        if (id.includes('node_modules')) {
                            return 'Vendor';
                        }
                    }
                }
            }
        },
        base: './',
        envDir: './Env',
        root: path.join(__dirname, ''),
        publicDir: 'Public',
        server: {
            port: 6768,
            host: '0.0.0.0',
            strictPort: true
        }
    };
});

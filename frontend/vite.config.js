import banner from 'vite-plugin-banner';
import {bannerText} from './source/utils/banner-text';
import constants from './source/utils/constants';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import {defineConfig} from 'vite';
import {resolve} from 'node:path';
import vuePlugin from '@vitejs/plugin-vue';

module.exports = defineConfig({
	define: {'process.env.NODE_ENV': '"production"'},
	build: {
		lib: {
			formats: ['iife'],
			entry: resolve(__dirname, 'source/tutorial.js'),
			name: 'TotalTutorial',
			fileName: () => `${constants.APP_NAME}.js`
		},
		rollupOptions: {
			treeshake: 'smallest',
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		},
		emptyOutDir: false
	},
	resolve: {
		alias: {
			vue: 'vue/dist/vue.esm-bundler.js'
		}
	},
	esbuild: {legalComments: 'none'},
	plugins: [
		vuePlugin(),
		cssInjectedByJsPlugin(),
		banner(bannerText)
	]
});

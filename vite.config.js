
//
const sourceMapsInProduction = true;

//
import autoprefixer from "autoprefixer";
import path from "node:path";
import {defineConfig} from "vite";
//import VitePluginBrowserSync from 'vite-plugin-browser-sync';
import prefetchPlugin from 'vite-plugin-bundle-prefetch';
import {compression} from "vite-plugin-compression2";
//import {nodePolyfills} from "vite-plugin-node-polyfills";
//import {VitePWA} from "vite-plugin-pwa";
import {viteStaticCopy} from "vite-plugin-static-copy";
import certificate from "./https/certificate.mjs";
import pkg from "./package.json" with { type: "json" };
import tsconfig from "./tsconfig.json" with { type: "json" };
//import vue from '@vitejs/plugin-vue'
//
//import json5Plugin from 'vite-plugin-json5'
//import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import nodeExternals from 'rollup-plugin-node-externals'
import createExternal from 'vite-plugin-external';
import cssnano from "cssnano";
import deduplicate from "postcss-discard-duplicates";
import postcssPresetEnv from 'postcss-preset-env';
import solidPlugin from 'vite-plugin-solid';
import rollupOptions, {plugins, NAME} from "./rollup/rollup.config";
import { viteSingleFile } from "vite-plugin-singlefile"

//
const __dirname = import.meta.dirname;
const r = (s) => { return s; };
const production = process.env.NODE_ENV === 'production';
const config = defineConfig({
    root: "./",
    base: './',
    resolve: {
        alias: {
            "@node_modules": path.resolve("./node_modules"),
            "@": path.resolve("./"),
            "@src": path.resolve("src/"),
            "@adl": path.resolve("src/"),
            "@assets": path.resolve("assets/")
        },
    },
    plugins: [
        solidPlugin({
            // solid-specific, other is inline/regular
            include: ["*/$solid$/*.ts", "*/$solid$/**/*.tsx"],
            dev: false
        }),
        createExternal({
            interop: 'auto',
            externals: {externals: "externals"},
            externalizeDeps: ["externals", "/externals", "./externals"]
        }),
        //json5Plugin(),
        /**/
        //nodePolyfills(),
        compression({
            algorithm: 'brotliCompress'
        }),
        prefetchPlugin(),
        viteSingleFile({
            useRecommendedBuildConfig: false,
            inlinePattern: ["!(service).mjs"]
        })
    ],
    server: {
        //open: '/frontend/index.html',
        origin: "",
        host: "0.0.0.0",
        port: 443,
        https: {
            ...certificate,
        },
        cors: {
            allowedHeaders: "*",
            preflightContinue: true,
            credentials: true,
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            origin: "*"
        },
        headers: {
            "Content-Security-Policy": "upgrade-insecure-requests",
            "Service-Worker-Allowed": "/",
            "Permissions-Policy": "fullscreen=*, window-management=*",
            "Cross-Origin-Embedder-Policy": "require-corp",
            "Cross-Origin-Opener-Policy": "same-origin",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Request-Headers": "*"
        }
    },
    esbuild: {
        target: "esnext",
        minifySyntax: true,
        minifyWhitespace: true,
        minifyIdentifiers: true
    },
    build: {
        chunkSizeWarningLimit: 1600,
        assetsInlineLimit: 1024 * 1024,
        minify: 'terser',
        sourcemap: 'hidden',
        target: "esnext",
        name: "app",
        lib: {
            formats: ["es"],
            entry: path.resolve(__dirname, './src/app.ts'),
            name: "app",
            fileName: "app",
        },
        outDir: "./frontend/app",
        emptyOutDir: true,
        rollupOptions/*: {
            external: ["externals", "/externals", "./externals"],
            output: {
                assetFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'chunks/[name]-[hash].js',
                entryFileNames: 'app.js',
            }
        },*/
    },
    css: {
        postcss: {
            plugins: [autoprefixer(), deduplicate(), cssnano({
                preset: ['default', {
                    calc: false,
                    discardComments: {
                        removeAll: true
                    }
                }],
            }), postcssPresetEnv({ stage: 0 })],
        },
    },
    optimizeDeps: {
        esbuildOptions: {target: "esnext", supported: {bigint: true}},
    },
});

//
export default config;
export {config};

// Load path aliases from the tsconfig.json file
const aliases = tsconfig.compilerOptions.paths;
for (const alias in aliases) {
    const paths = aliases[alias].map((p) => path.resolve(__dirname, p));
    const viteAlias = alias.replace(/(\\|\/)\*$/, '');
    const vitePaths = paths.map((p) => p.replace(/(\\|\/)\*$/, ''));

    //
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    if (config.resolve && config.resolve.alias && !(viteAlias in config.resolve.alias)) {
        config.resolve.alias[viteAlias] = vitePaths.length > 1 ? vitePaths : vitePaths[0];
    }
}

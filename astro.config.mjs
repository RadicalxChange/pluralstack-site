import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';
import { sanityConfig } from './src/utils/sanity-client';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    // @astrojs/sitemap needs an absolute site URL to emit sitemap-index.xml.
    // Netlify sets URL to the deploy's primary address; set SITE_URL to override
    // once a custom domain is in place.
    site: process.env.SITE_URL ?? process.env.URL ?? 'http://localhost:3000',
    image: {
        domains: ['cdn.sanity.io']
    },
    integrations: [sanity(sanityConfig), sitemap()],
    vite: {
        plugins: [tailwindcss()],
        server: {
            hmr: { path: '/vite-hmr/' },
            allowedHosts: ['.netlify.app']
        }
    },
    server: {
        port: 3000
    }
});
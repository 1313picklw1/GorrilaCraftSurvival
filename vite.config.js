import { defineConfig } from 'vite';

export default defineConfig({
    base: '/GorrilaCraftSurvival/',  // Path for GitHub Pages
    root: 'public',                  // Source folder for HTML and assets
    build: {
        outDir: '../dist'            // Output directory for the build
    }
});

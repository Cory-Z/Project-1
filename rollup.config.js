import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs'; // Added to handle potential commonjs dependencies

export default {
  input: 'index.html', // Entry point for the application
  output: {
    entryFileNames: '[hash].js', // Unique hashed file names for cache busting
    chunkFileNames: '[hash].js',
    assetFileNames: '[hash][extname]',
    format: 'es', // ES module format for modern browsers
    dir: 'public', // Output directory for the build files
  },
  preserveEntrySignatures: false, // Ensure compatibility with dynamic imports

  plugins: [
    /** Enable using HTML as Rollup entrypoint */
    html({
      minify: true, // Minify HTML for production
    }),
    /** Resolve bare module imports (node_modules) */
    nodeResolve({
      browser: true, // Ensure browser-compatible modules are resolved
      dedupe: ['lit'], // Prevent duplicate instances of `lit`
    }),
    /** Handle potential CommonJS dependencies */
    commonjs(),
    /** Minify and transpile JavaScript for target browsers */
    esbuild({
      minify: true, // Minify JS for production
      target: ['chrome64', 'firefox67', 'safari11.1'], // Target modern browser versions
    }),
    /** Bundle assets referenced via import.meta.url */
    importMetaAssets(),
    /** Minify HTML and CSS in tagged template literals */
    babel({
      babelHelpers: 'bundled',
      plugins: [
        [
          'babel-plugin-template-html-minifier',
          {
            modules: { lit: ['html', { name: 'css', encapsulation: 'style' }] },
            failOnError: false,
            strictCSS: true,
            htmlMinifier: {
              collapseWhitespace: true, // Minify whitespace
              conservativeCollapse: true,
              removeComments: true,
              caseSensitive: true,
              minifyCSS: true, // Minify inline CSS
            },
          },
        ],
      ],
    }),
  ],
};

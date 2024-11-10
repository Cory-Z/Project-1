import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import html from '@web/rollup-plugin-html';
import importMetaAssets from '@web/rollup-plugin-import-meta-assets';
import babel from '@rollup/plugin-babel';
import esbuild from 'rollup-plugin-esbuild';

export default {
  input: 'P1analyzer.js', // Entry point for your project
  output: {
    file: 'public/bundle.js', // Output the bundle to public/bundle.js
    format: 'es', // Use ES module format
    sourcemap: true, // Enable sourcemap for debugging
  },
  
  plugins: [
    nodeResolve(), // Resolve bare module imports
    commonjs(), // Convert CommonJS modules to ES modules
    esbuild({
      minify: true, // Minify the output
      target: 'es2017', // Target modern JavaScript syntax
    }),
    html({
      input: 'public/index.html', // Specify your HTML entry point
      minify: true, // Minify the HTML
    }),
    importMetaAssets(), // Handle assets referenced via import.meta
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
              collapseWhitespace: true,
              conservativeCollapse: true,
              removeComments: true,
              caseSensitive: true,
              minifyCSS: true,
            },
          },
        ],
      ],
    }),
  ],
};

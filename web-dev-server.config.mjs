/** Use Hot Module Replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: '/', // Automatically open the browser at the root
  watch: !hmr, // Enable or disable file watching based on HMR flag
  https: false, // Change to true if you need HTTPS locally
  dedupe: true, // Prevent duplicate versions of dependencies like 'lit'

  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'], // Resolve modern browser-compatible code
  },

  
  /** Set appIndex to enable SPA routing */
  appIndex: 'public/index.html', // Specify the index file for SPA routing

  /** Plugins */
  plugins: [
    /** Enable Hot Module Replacement if --hmr flag is used */
    hmr && hmrPlugin({
      exclude: ['**/*/node_modules/**/*'], // Exclude dependencies from HMR
      presets: [presets.litElement], // Apply HMR specifically for LitElement
    }),
  ].filter(Boolean), // Filter out null values if HMR is not enabled

  /** Optional: Uncomment and configure esbuild for compatibility with older browsers */
  // esbuildTarget: 'auto', // Auto-detect and compile for older browser support

  /** Other Options */
  watchServe: true, // Reload the browser on file changes
  rootDir: './', // Serve files relative to the project root
});

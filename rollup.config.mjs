import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
      interop: "auto"
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true
    }
  ],
  external: ["react", "react-dom", "react/jsx-runtime", "d3-interpolate"],
  plugins: [
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
      inlineSources: true
    })
  ],
  treeshake: {
    moduleSideEffects: false
  },
  onwarn: function(warning, warn) {
    // Skip certain warnings
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      // Ignore circular dependency warnings from d3-interpolate
      if (warning.message.includes('d3-interpolate')) {
        return;
      }
    }
    // Use default for everything else
    warn(warning);
  }
};
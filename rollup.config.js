import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = [
  {
    input: "src/index.ts", // entry point
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }),
      babel({
        exclude: ["node_modules/**"],
        babelHelpers: "bundled",
        external: [/@babel\/runtime/],
      }),
    ],
  },
];

export default config;

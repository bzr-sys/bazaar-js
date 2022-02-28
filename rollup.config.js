import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = [
  {
    input: "src/rethinkid-js-sdk.ts", // your entry point
    output: {
      name: "rethinkid-js-sdk", // package name
      file: pkg.browser,
      format: "umd",
    },
    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }),
      resolve(),
      commonjs(),
      babel({
        exclude: ["node_modules/**"],
      }),
    ],
  },
  {
    input: "src/rethinkid-js-sdk.ts", // your entry point
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }),
      babel({
        exclude: ["node_modules/**"],
      }),
    ],
  },
];

export default config;

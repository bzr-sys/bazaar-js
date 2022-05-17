import nodePolyfills from "rollup-plugin-polyfill-node";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = [
  // An ES6 module export, the main export
  {
    input: "src/index.ts", // entry point
    output: [
      {
        file: pkg.main,
        format: "esm",
        exports: "auto",
      },
    ],
    external: ["client-oauth2", "jwt-decode", "socket.io-client"],
    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }),
      babel({
        exclude: ["node_modules/**"],
        babelHelpers: "bundled",
        external: [/@babel\/runtime/],
      }),
    ],
  },
  // An IIFE export with bundled deps for conveniently using with a script tag
  {
    input: "src/index.ts", // entry point
    output: [
      {
        name: "RethinkID",
        file: "dist/rethinkid-js-sdk.iife.js",
        format: "iife",
      },
    ],
    plugins: [
      nodePolyfills(),
      resolve({ browser: true }),
      commonjs(),
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

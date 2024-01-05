import nodePolyfills from "rollup-plugin-polyfill-node";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";
import replace from '@rollup/plugin-replace';
import pkg from "./package.json" assert { type: "json" };

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
    external: ["@badgateway/oauth2-client", "jwt-decode", "socket.io-client"],
    plugins: [
      typescript(),
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
        footer: 'RethinkID = RethinkID.RethinkID;',
      },
    ],
    plugins: [
      nodePolyfills(),
      resolve({ browser: true }),
      commonjs(),
      typescript(),
      babel({
        exclude: ["node_modules/**"],
        babelHelpers: "bundled",
        external: [/@babel\/runtime/],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        preventAssignment: true,
      }),
    ],
  },
];

export default config;

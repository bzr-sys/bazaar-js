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
];

export default config;

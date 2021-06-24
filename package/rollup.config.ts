import { defineConfig } from "rollup";
import { eslint } from "rollup-plugin-eslint";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";


export default defineConfig({
    input: "src/index.ts",
    plugins: [eslint(), typescript(), terser()],
    output: [
        {
            file: pkg.main,
            format: "cjs",
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: "esm",
            sourcemap: true,
        },
    ],
    external: ["react", "react-dom"],
});

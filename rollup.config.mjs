import esbuild from "rollup-plugin-esbuild";
import dts from "rollup-plugin-dts";

const input = "src/maybe.ts";

export default [
  {
    input,
    plugins: [esbuild()],
    output: [
      {
        file: `dist/index.js`,
        format: "cjs",
        sourcemap: true,
      },
    ],
  },
  {
    input,
    plugins: [dts()],
    output: {
      file: `dist/index.d.ts`,
      format: "es",
    },
  },
];
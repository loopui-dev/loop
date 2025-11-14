import { defineConfig } from "tsdown";

export default defineConfig({
    entry: "src/index.ts",
    unbundle: true,
    dts: {
        tsgo: true,
        sourcemap: true,
    },
    format: ["esm"],
    external: /^[a-zA-Z0-9@].*/,
});

import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { netsu } from "@recompose/netsu/plugin";

export default defineConfig({
  plugins: [remix(), tsconfigPaths(), netsu()],
});

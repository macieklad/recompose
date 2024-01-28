import devServer, { DevServerOptions } from "@hono/vite-dev-server";

export function netsu(config: DevServerOptions): ReturnType<typeof devServer>;

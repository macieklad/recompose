import devServer, { defaultOptions } from "@hono/vite-dev-server";

export function netsu({ entry = "./server.ts", exclude = [], ...options } = {}) {
  return devServer({
    injectClientScript: false,
    entry,
    exclude: [/^\/(app)\/.+/, ...defaultOptions.exclude, ...exclude],
    ...options,
  });
}

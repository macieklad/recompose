import { serve as honoServe } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { createCookieSessionStorage } from "@remix-run/node";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { createMiddleware } from "hono/factory";
import { remix as remixHandler } from "remix-hono/handler";
import { session } from "remix-hono/session";
import * as path from "path";

export function createApp({
  getLoadContext: getAppLoadContext,
  session: { enabled: sessionEnabled, autoCommit = false, createSessionStorage, sessionParams },
  withLogger = true,
  withAssetCache = true,
  withRuntimeCache = true,
  remixProductionBuildPath,
  remixClientBuildRoot = "./build/client",
}) {
  const isProductionMode = process.env.NODE_ENV === "production";
  const app = new Hono();

  /**
   * Serve assets files from build/client/assets
   */
  if (withAssetCache) {
    app.use(
      "/assets/*",
      cache(60 * 60 * 24 * 365), // 1 year
      serveStatic({ root: remixClientBuildRoot }),
    );
  }

  /**
   * Serve public files
   */
  if (withRuntimeCache) {
    app.use("*", cache(60 * 60), serveStatic({ root: remixClientBuildRoot })); // 1 hour
  }

  /**
   * Add logger middleware
   */
  if (withLogger) {
    app.use("*", logger());
  }

  /**
   * Add session middleware (https://github.com/sergiodxa/remix-hono?tab=readme-ov-file#session-management)
   */
  if (sessionEnabled) {
    app.use(
      session({
        autoCommit: !!createSessionStorage ? autoCommit : true,
        createSessionStorage:
          createSessionStorage ??
          (() => {
            if (!process.env.SESSION_SECRET && isProductionMode) {
              throw new Error("SESSION_SECRET is not defined");
            }

            return createCookieSessionStorage({
              cookie: {
                name: "session",
                httpOnly: true,
                path: "/",
                sameSite: "lax",
                secrets: [process.env.SESSION_SECRET ?? "secret"],
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 30,
                ...sessionParams,
              },
            });
          }),
      }),
    );
  }

  async function remix() {
    const viteDevServer =
      process.env.NODE_ENV === "production"
        ? undefined
        : await import("vite").then((vite) =>
            vite.createServer({
              server: { middlewareMode: true },
            }),
          );

    app.use("*", async (c, next) => {
      const build = isProductionMode
        ? /* @vite-ignore */
          await import(remixProductionBuildPath ?? path.resolve(process.cwd(), "./build/server/index.js"))
        : await viteDevServer?.ssrLoadModule("virtual:remix/server-build");

      return remixHandler({
        build,
        mode: isProductionMode ? "production" : "development",
        getLoadContext() {
          return {
            appVersion: isProductionMode ? build.assets.version : "dev",
            ...getAppLoadContext?.(),
          };
        },
      })(c, next);
    });
  }

  function serve({ port }) {
    return honoServe(
      {
        ...app,
        port: port || Number(process.env.PORT) || 3000,
      },
      async (info) => {
        console.log(`🚀 Server started on port ${info.port}`);
      },
    );
  }

  app.remix = remix;
  app.serve = serve;

  return app;
}

function cache(seconds) {
  return createMiddleware(async (c, next) => {
    await next();

    if (!c.res.ok) {
      return;
    }

    c.res.headers.set("cache-control", `public, max-age=${seconds}`);
  });
}

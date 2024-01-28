import type { Hono, Env as HonoEnv, Schema as HonoSchema } from "hono";
import type { SessionStorage, SessionIdStorageStrategy } from "@remix-run/server-runtime";

export function createApp<Env extends HonoEnv = HonoEnv, Schema extends HonoSchema = HonoSchema, Base = "/">(
  config: {
    getLoadContext?: () => Record<string, unknown>;
    session?: {
      enabled?: boolean;
      autoCommit?: boolean;
      createSessionStorage?: () => SessionStorage;
      sessionCookieParams?: SessionIdStorageStrategy["cookie"];
    };
    withLogger?: boolean;
    withAssetCache?: boolean;
    withRuntimeCache?: boolean;
    remixProductionBuildPath?: string;
    remixClientBuildRoot?: string;
  } = {},
): {
  remix: (config: { remixProductionBuildPath?: string } = {}) => Promise<void>;
  serve: (config: { port?: number } = {}) => void;
} & Hono<Env, Schema, Base>;

export { getSessionStorage, getSession } from "remix-hono/session";

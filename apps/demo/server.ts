import { createApp } from "@recompose/netsu";
import * as process from "process";

const app = createApp();

app.get("/hello-world", (c) => c.json({ hello: "world" }));

await app.remix();

if (process.env.NODE_ENV === "production") {
  app.serve();
}

export default app;

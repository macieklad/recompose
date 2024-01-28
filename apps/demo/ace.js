import { fileURLToPath } from "node:url";
import { register } from "node:module";
import { createKernel } from "@recompose/ace";

register("ts-node/esm", import.meta.url);

const { handle, loadCommandsFromFs } = createKernel();

loadCommandsFromFs(fileURLToPath(new URL("./app/console", import.meta.url)));

await handle();

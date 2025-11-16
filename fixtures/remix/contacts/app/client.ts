import { createClient } from "@loopui/data";
import { api } from "./api.ts";
import type { handlers } from "./worker/handlers.ts";

export const client = createClient<typeof api, typeof handlers>(api);

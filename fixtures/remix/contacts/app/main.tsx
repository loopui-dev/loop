import { WorkerRegistry } from "@loopui/worker";
import { createRoot } from "@remix-run/dom";
import { on } from "@remix-run/interaction";
import { Router } from "./lib/Router.tsx";
import { handlers, routes } from "./routes.tsx";

import "./index.css";

const script = import.meta.env.DEV ? "/entry.worker.ts" : "/entry.worker.js";
const registry = new WorkerRegistry(script);

on(registry, {
    registered() {
        createRoot(document.body).render(
            <Router fallback={<p class="loading">Loading...</p>} routes={routes}>
                {handlers}
            </Router>,
        );
    },
});

await registry.register();

import { WorkerRegistry } from "@loopui/worker";
import { createRoot } from "@remix-run/dom";
import { on } from "@remix-run/interaction";
import { Router } from "./lib/Router.tsx";
import { handlers, routes } from "./routes.tsx";

import "./index.css";

const worker = import.meta.env.DEV ? "/entry.worker.ts" : "/entry.worker.js";
const registry = new WorkerRegistry(worker);

on(registry, {
    registered() {
        createRoot(document.body).render(<Router routes={routes}>{handlers}</Router>);
    },
});

await registry.register();

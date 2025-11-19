import { createRoot } from "@remix-run/dom";
import { handlers } from "./handlers.tsx";
import { Router } from "./lib/Router.tsx";
import { routes } from "./routes.ts";

createRoot(document.body).render(
    <Router fallback={<p class="loading">Loading...</p>} handlers={handlers} routes={routes} />,
);

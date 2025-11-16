import { createRouter } from "@remix-run/fetch-router";
import { formData } from "@remix-run/fetch-router/form-data-middleware";
import { logger } from "@remix-run/fetch-router/logger-middleware";
import { on, type TypedEventTarget } from "@remix-run/interaction";
import { api } from "~/api.ts";
import { clientRedirect, methodOverride } from "~/lib/middleware.ts";
import { handlers } from "~/worker/handlers.ts";

declare const self: ServiceWorkerGlobalScope & TypedEventTarget<ServiceWorkerGlobalScopeEventMap>;

let router = createRouter({
    middleware: [
        formData(),
        methodOverride(),
        clientRedirect(),
        ...(import.meta.env.DEV ? [logger()] : []),
    ],
});

router.map(api, handlers);

on(self, {
    install() {
        self.skipWaiting();
    },
    activate() {
        self.clients.claim();
    },
    fetch(event) {
        let url = new URL(event.request.url);
        let sameOrigin = url.origin === location.origin;
        let maybeApi = url.pathname.startsWith("/api/");

        // Only handle same-origin API requests
        if (!sameOrigin || !maybeApi) return;

        event.respondWith(router.fetch(event.request));
    },
});

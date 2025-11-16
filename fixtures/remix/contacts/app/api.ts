import { createResources, createRoutes } from "@remix-run/fetch-router";

export let api = createRoutes("/api", {
    contact: {
        list: { method: "GET", pattern: "/contact?q" },
        ...createResources("/contact", {
            only: ["show", "destroy", "update", "create"],
            param: "contactId",
        }),
        favorite: { method: "PUT", pattern: "/contact/:contactId/favorite" },
    },
});

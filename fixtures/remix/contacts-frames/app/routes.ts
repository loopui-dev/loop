import { resources, route } from "@remix-run/fetch-router";

export const routes = route({
    contacts: {
        index: { method: "GET", pattern: "/" },
        show: { method: "GET", pattern: "/contact/:contactId" },
        edit: { method: "GET", pattern: "/contact/:contactId/edit" },
        ...resources("/contact", {
            only: ["destroy", "update", "create"],
            param: "contactId",
        }),
        favorite: { method: "PUT", pattern: "/contact/:contactId/favorite" },
    },
    frames: {
        list: { method: "GET", pattern: "/_frame/list" },
        index: { method: "GET", pattern: "/_frame/index" },
        show: { method: "GET", pattern: "/_frame/contact/:contactId" },
        edit: { method: "GET", pattern: "/_frame/contact/:contactId/edit" },
    },
});

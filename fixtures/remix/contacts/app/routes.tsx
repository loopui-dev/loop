import { type AppHandlers, createRoutes } from "@loopui/dom-router";
import type { Remix } from "@remix-run/dom";
import { client } from "./api.ts";
import { EditContact } from "./routes/edit-contaxt.tsx";
import { Index } from "./routes/index.tsx";
import { Root } from "./routes/root.tsx";
import { ShowContact } from "./routes/show-contact.tsx";

export const routes = createRoutes({
    root: {
        pattern: "/?q",
        children: {
            index: "/",
            contact: {
                show: "/contact/:contactId",
                edit: "/contact/:contactId/edit",
            },
        },
    },
});

export const handlers = {
    root: {
        preload: ({ searchParams }) => client.contact.list.fetch({ searchParams }),
        render: ({ searchParams }) => <Root query={searchParams.q} />,
        children: {
            index: {
                render: <Index />,
            },
            contact: {
                show: {
                    preload: ({ params }) => client.contact.show.fetch({ params }),
                    render: ({ params }) => <ShowContact id={params.contactId} />,
                },
                edit: {
                    preload: ({ params }) => client.contact.show.fetch({ params }),
                    render: ({ params }) => <EditContact id={params.contactId} />,
                },
            },
        },
    },
} satisfies AppHandlers<typeof routes, Remix.RemixNode>;

import type { RouteHandlers } from "@remix-run/fetch-router";
import { redirect } from "@remix-run/fetch-router/response-helpers";
import { edit } from "./fragments/edit.tsx";
import { list } from "./fragments/list.tsx";
import { show } from "./fragments/show.tsx";
import { createEmptyContact, deleteContact, updateContact } from "./lib/contacts.ts";
import { Root } from "./Root.tsx";
import { routes } from "./routes.ts";

export const handlers: RouteHandlers<typeof routes> = {
    frames: {
        index: () => (
            <p id="index-page">
                This is a demo for Remix.
                <br />
                Check out{" "}
                <a href="https://github.com/remix-run/remix">
                    the preview at github.com/remix-run/remix
                </a>
                .
            </p>
        ),
        list,
        show,
        edit,
    },
    contacts: {
        index: async () => <Root />,
        show: async () => <Root />,
        edit: async () => <Root />,

        // Actions
        async destroy({ params }) {
            await deleteContact(params.contactId);
            return redirect(routes.contacts.index.href());
        },
        async update({ params, formData }) {
            const contact = await updateContact(params.contactId, {
                first: formData.get("first") as string,
                last: formData.get("last") as string,
                bsky: formData.get("bsky") as string,
                avatar: formData.get("avatar") as string,
                notes: formData.get("notes") as string,
            });
            return redirect(routes.contacts.show.href({ contactId: contact.id }));
        },
        async create() {
            const contact = await createEmptyContact();
            return redirect(routes.contacts.edit.href({ contactId: contact.id }));
        },
        async favorite({ params, formData }) {
            const favorite = formData.get("favorite") === "true";
            await updateContact(params.contactId, { favorite });
            return new Response(null);
        },
    },
};

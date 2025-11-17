import { json, type RouteHandlers } from "@loopui/server";
import { redirect } from "@remix-run/fetch-router/response-helpers";
import type { api } from "~/api.ts";
import { routes } from "~/routes.tsx";
import {
    createEmptyContact,
    deleteContact,
    getContact,
    getContacts,
    updateContact,
} from "./contacts.ts";

export let handlers = {
    contact: {
        async list({ url }) {
            let query = url.searchParams.get("q");
            let contacts = await getContacts(query);
            return json(contacts);
        },
        async show({ params }) {
            let contact = await getContact(String(params.contactId));
            return json(contact);
        },
        async destroy({ params }) {
            await deleteContact(String(params.contactId));
            return redirect(routes.index.href());
        },
        async update({ params, formData }) {
            let contact = await updateContact(String(params.contactId), {
                first: formData.get("first") as string,
                last: formData.get("last") as string,
                twitter: formData.get("twitter") as string,
                avatar: formData.get("avatar") as string,
                notes: formData.get("notes") as string,
            });
            return redirect(routes.contact.show.href({ contactId: contact.id }));
        },
        async create() {
            await createEmptyContact();
            return new Response(null);
        },
        async favorite({ params, formData }) {
            let favorite = formData.get("favorite") === "true";
            await updateContact(String(params.contactId), { favorite });
            return new Response(null);
        },
    },
} satisfies RouteHandlers<typeof api>;

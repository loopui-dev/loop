import type { InferRequestHandler } from "@remix-run/fetch-router";
import { matchSorter } from "match-sorter";
import { ContactItem } from "~/components/Sidebar.tsx";
import { getContacts } from "~/lib/contacts.ts";
import type { routes } from "~/routes.ts";

export const list: InferRequestHandler<typeof routes.frames.list> = async ({ url }) => {
    const query = url.searchParams.get("q");
    let contacts = await getContacts();
    if (query) {
        contacts = matchSorter(contacts, query, {
            keys: ["first", "last"],
        });
    }

    const r = new Response();

    if (!contacts.length) {
        r.__element = (
            <p>
                <i>No contacts</i>
            </p>
        );
        return r;
    }

    r.__element = (
        <ul>
            {contacts.map(contact => (
                <ContactItem contact={contact} key={contact.id} />
            ))}
        </ul>
    );
    return r;
};

import type { Remix } from "@remix-run/dom";
import { on } from "@remix-run/interaction";
import { client } from "~/api.ts";
import { Router } from "~/lib/Router.tsx";
import { Root } from "~/routes/root.tsx";
import { routes } from "~/routes.tsx";
import type { ContactRecord } from "~/worker/contacts.ts";

export function Sidebar(this: Remix.Handle) {
    const router = this.context.get(Router);
    on(router, this.signal, { navigatesuccess: () => this.update() });
    on(client.contact.list, this.signal, { statechange: () => this.update() });

    return () => {
        const { query } = this.context.get(Root);
        const state = client.contact.list.peek({
            searchParams: { q: query },
        });
        const contacts = state.value as ContactRecord[];

        return (
            <nav>
                {contacts.length ? (
                    <ul>
                        {contacts.map(contact => (
                            <SidebarItem contact={contact} key={contact.id} />
                        ))}
                    </ul>
                ) : (
                    <p>
                        <i>No contacts</i>
                    </p>
                )}
            </nav>
        );
    };
}

function SidebarItem(this: Remix.Handle) {
    const router = this.context.get(Router);
    on(router, this.signal, {
        navigate: () => this.update(),
        navigatesuccess: () => this.update(),
    });

    return ({ contact }: { contact: ContactRecord }) => {
        const link =
            routes.contact.show.href({
                contactId: String(contact.id),
            }) + router.url.search;

        return (
            <li>
                <a class={router.when(link, { active: "active", pending: "pending" })} href={link}>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}
                    {contact.favorite && <span>★</span>}
                </a>
            </li>
        );
    };
}

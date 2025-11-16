import type { Remix } from "@remix-run/dom";
import { on } from "@remix-run/interaction";
import { assert } from "@std/assert";
import { client } from "~/client.ts";
import { Router } from "~/lib/Router.tsx";
import { Root } from "~/routes/root.tsx";
import { routes } from "~/routes.tsx";
import type { ContactRecord } from "~/worker/contacts.ts";

export function Sidebar(this: Remix.Handle) {
    let navigator = this.context.get(Router);
    on(navigator, this.signal, { navigatesuccess: () => this.update() });
    on(client.contact.list, this.signal, { statechange: () => this.update() });

    return () => {
        let { query } = this.context.get(Root);
        let { value: contacts } = client.contact.list.get({
            searchParams: { q: query },
        });
        assert(contacts, "contacts not preloaded");

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
    let navigator = this.context.get(Router);
    on(navigator, this.signal, { statechange: () => this.update() });

    return ({ contact }: { contact: ContactRecord }) => {
        let link = routes.contact.show.href({ contactId: contact.id }) + navigator.url.search;
        let className = navigator.when(link, { active: "active", pending: "pending" });

        return (
            <li>
                <a class={className} href={link}>
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

import { Frame, type Remix } from "@remix-run/dom";
import type { ContactRecord } from "~/lib/contacts.ts";
import { on } from "~/lib/on.ts";
import { Router } from "~/lib/Router.tsx";
import { routes } from "~/routes.ts";

export function Sidebar(this: Remix.Handle) {
    const router = this.context.get(Router);
    on(router, this.signal, { statechange: () => this.update() });

    return () => {
        const query = router.searchParams.get("q");
        const src = routes.frames.list.href(null, query ? { q: query } : {});

        return (
            <nav>
                <Frame src={src} />
            </nav>
        );
    };
}

export function ContactItem(this: Remix.Handle, { contact }: { contact: ContactRecord }) {
    const router = this.context.get(Router);
    on(router, this.signal, { statechange: () => this.update() });

    return () => {
        const link = routes.contacts.show.href({ contactId: contact.id }) + router.url.search;
        const className = router.when(link, { active: "active", pending: "pending" });

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

import type { Remix } from "@remix-run/dom";
import { dom } from "@remix-run/events";
import { press } from "@remix-run/events/press";
import { on } from "@remix-run/interaction";
import { assert } from "@std/assert";
import { client } from "~/client.ts";
import { Router } from "~/lib/Router.tsx";
import type { ShowContact } from "./show-contact.tsx";

export function EditContact(this: Remix.Handle, initialProps: ShowContact.Props) {
    let id = initialProps.id;

    let navigator = this.context.get(Router);
    on(navigator, this.signal, { navigatesuccess: () => this.update() });

    let show = client.contact.show.filter(([{ params }]) => params.contactId === id);
    on(show, this.signal, { statechange: () => this.update() });

    return (props: ShowContact.Props) => {
        id = props.id;

        let {
            on: { submit },
            ...action
        } = client.contact.update.form({ contactId: id });

        let { value: contact } = client.contact.show.get({ params: { contactId: id } });
        assert(contact, "contact not preloaded");

        return (
            <form {...action} id="contact-form" on={dom.submit(submit)}>
                <p>
                    <span>Name</span>
                    <input
                        aria-label="First name"
                        name="first"
                        placeholder="First"
                        type="text"
                        value={contact.first ?? ""}
                    />
                    <input
                        aria-label="Last name"
                        name="last"
                        placeholder="Last"
                        type="text"
                        value={contact.last ?? ""}
                    />
                </p>
                <label>
                    <span>𝕏, The Everything App</span>
                    <input
                        name="twitter"
                        placeholder="@elonmusk"
                        type="text"
                        value={contact.twitter ?? ""}
                    />
                </label>
                <label>
                    <span>Avatar URL</span>
                    <input
                        aria-label="Avatar URL"
                        name="avatar"
                        placeholder="https://example.com/avatar.jpg"
                        type="text"
                        value={contact.avatar ?? ""}
                    />
                </label>
                <label>
                    <span>Notes</span>
                    <textarea name="notes" rows={6} value={contact.notes ?? ""} />
                </label>
                <p>
                    <button type="submit">Save</button>
                    <button on={press(() => navigator.back())} type="button">
                        Cancel
                    </button>
                </p>
            </form>
        );
    };
}

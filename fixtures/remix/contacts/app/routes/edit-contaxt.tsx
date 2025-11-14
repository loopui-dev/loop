import type { Remix } from "@remix-run/dom";
import { dom } from "@remix-run/events";
import { press } from "@remix-run/events/press";
import { on } from "@remix-run/interaction";
import { client } from "~/api.ts";
import { Router } from "~/lib/Router.tsx";
import type { ContactRecord } from "~/worker/contacts.ts";
import type { ShowContact } from "./show-contact.tsx";

export function EditContact(this: Remix.Handle, initialProps: ShowContact.Props) {
    let id = initialProps.id;

    const router = this.context.get(Router);
    on(router, this.signal, { navigatesuccess: () => this.update() });

    on(client.contact.show, this.signal, {
        statechange: ({ input }) => {
            const [{ params }] = input;
            if (params.contactId === id) {
                this.update();
            }
        },
    });

    return (props: ShowContact.Props) => {
        id = props.id;

        const { on: onsubmit, ...update } = client.contact.update.form({ contactId: id });
        const state = client.contact.show.peek({
            params: { contactId: id },
        });
        const contact = state.value as ContactRecord;

        return (
            <form {...update} id="contact-form" on={dom.submit(onsubmit)}>
                <title>{`Editing ${contact.first} ${contact.last} | Remix Contacts`}</title>
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
                    <button on={press(() => router.back())} type="button">
                        Cancel
                    </button>
                </p>
            </form>
        );
    };
}

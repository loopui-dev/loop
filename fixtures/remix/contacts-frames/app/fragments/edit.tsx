import type { InferRequestHandler } from "@remix-run/fetch-router";
import { CancelButton } from "~/components/CancelButton.tsx";
import { RestfulForm } from "~/components/RestfulForm.tsx";
import { getContacts } from "~/lib/contacts.ts";
import { routes } from "~/routes.ts";

export const edit: InferRequestHandler<typeof routes.frames.edit> = async ({ params }) => {
    const contacts = await getContacts();
    const contact = contacts.find(c => c.id === params.contactId)!;

    return (
        <RestfulForm
            action={routes.contacts.update.href({ contactId: params.contactId })}
            id="contact-form"
            method={routes.contacts.update.method}
        >
            <p>
                <span>Name</span>
                <input
                    aria-label="First name"
                    defaultValue={contact.first ?? undefined}
                    name="first"
                    placeholder="First"
                    type="text"
                />
                <input
                    aria-label="Last name"
                    defaultValue={contact.last ?? undefined}
                    name="last"
                    placeholder="Last"
                    type="text"
                />
            </p>
            <label>
                <span>Bluesky</span>
                <input
                    defaultValue={contact.bsky ?? undefined}
                    name="bsky"
                    placeholder="jay.bsky.team"
                    type="text"
                />
            </label>
            <label>
                <span>Avatar URL</span>
                <input
                    aria-label="Avatar URL"
                    defaultValue={contact.avatar ?? undefined}
                    name="avatar"
                    placeholder="https://example.com/avatar.jpg"
                    type="text"
                />
            </label>
            <label>
                <span>Notes</span>
                <textarea name="notes" rows={6} value={contact.notes ?? undefined} />
            </label>
            <p>
                <button type="submit">Save</button>
                <CancelButton />
            </p>
        </RestfulForm>
    );
};

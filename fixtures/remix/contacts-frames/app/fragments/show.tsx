import type { InferRequestHandler } from "@remix-run/fetch-router";
import { DeleteButton } from "~/components/DeleteButton.tsx";
import { Favorite } from "~/components/Favorite.tsx";
import { RestfulForm } from "~/components/RestfulForm.tsx";
import { getContacts } from "~/lib/contacts.ts";
import { routes } from "~/routes.ts";

export const show: InferRequestHandler<typeof routes.frames.show> = async ({ params }) => {
    const contacts = await getContacts();
    const contact = contacts.find(c => c.id === params.contactId)!;

    return (
        <div id="contact">
            <div>
                <img
                    alt=""
                    key={contact.avatar}
                    src={
                        contact.avatar ||
                        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                    }
                />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}

                    <Favorite favorite={contact.favorite!} id={params.contactId} />
                </h1>

                {contact.bsky && (
                    <p>
                        <a
                            href={`https://bsky.app/profile/${contact.bsky}`}
                            rel="noreferrer"
                            target="_blank"
                        >
                            {contact.bsky}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <RestfulForm
                        action={routes.contacts.edit.href({ contactId: params.contactId })}
                        method={routes.contacts.edit.method}
                    >
                        <button type="submit">Edit</button>
                    </RestfulForm>
                    <DeleteButton id={params.contactId} />
                </div>
            </div>
        </div>
    );
};

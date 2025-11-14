import type { Remix } from "@remix-run/dom";
import { dom } from "@remix-run/events";
import { on } from "@remix-run/interaction";
import { client } from "~/api.ts";
import { Favorite } from "~/components/Favorite.tsx";
import { Router } from "~/lib/Router.tsx";
import { routes } from "~/routes.tsx";
import type { ContactRecord } from "~/worker/contacts.ts";

export namespace ShowContact {
    export interface Props {
        id: string;
    }
}

export function ShowContact(this: Remix.Handle, initialProps: ShowContact.Props) {
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

    on(client.contact.destroy, this.signal, {
        enhance: event => {
            const [params] = event.input;
            if (params.contactId === id) {
                const pleaseDontDestroy = !confirm(
                    "Please confirm you want to delete this record.",
                );
                if (pleaseDontDestroy) {
                    event.preventDefault();
                }
            }
        },
    });

    return (props: ShowContact.Props) => {
        id = props.id;

        const {
            on: { submit },
            ...action
        } = client.contact.destroy.form({
            contactId: id,
        });
        const state = client.contact.show.peek({
            params: { contactId: id },
        });
        const contact = state.value as ContactRecord;

        return (
            <div id="contact">
                <title>{`${contact.first} ${contact.last} | Remix Contacts`}</title>
                <div>
                    <img
                        alt=""
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
                        )}{" "}
                        <Favorite favorite={contact.favorite!} id={contact.id} />
                    </h1>

                    {contact.twitter && (
                        <p>
                            <a
                                href={`https://xcancel.com/${contact.twitter.slice(1, contact.twitter.length)}`}
                                rel="noreferrer"
                                target="_blank"
                            >
                                {contact.twitter}
                            </a>
                        </p>
                    )}

                    {contact.notes && <p>{contact.notes}</p>}

                    <div>
                        <form
                            action={routes.contact.edit.href({
                                contactId: contact.id,
                            })}
                            method="get"
                        >
                            <button type="submit">Edit</button>
                        </form>
                        <form {...action} on={dom.submit(submit)}>
                            <button type="submit">Delete</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    };
}

import type { Remix } from "@remix-run/dom";
import { dom } from "@remix-run/events";
import { on } from "@remix-run/interaction";
import { client } from "~/client.ts";

export namespace Favorite {
    export interface Props {
        favorite: boolean;
        id: string;
    }
}

export function Favorite(this: Remix.Handle, initialProps: Favorite.Props) {
    let id = initialProps.id;
    let favorite = initialProps.favorite;
    let optimistic: boolean | undefined;

    const fave = client.contact.favorite.filter(([params]) => params.contactId === id);

    on(fave, this.signal, {
        submit: ({ formData }) => {
            optimistic = formData.get("favorite") === "true";
            this.update();
        },
        settled: () => {
            optimistic = undefined;
            this.update();
        },
    });

    return (props: Favorite.Props) => {
        id = props.id;
        favorite = props.favorite;

        const {
            on: { submit },
            ...action
        } = client.contact.favorite.form({ contactId: id });

        const effective = optimistic ?? favorite;

        return (
            <form {...action} on={dom.submit(submit)}>
                <button
                    aria-label={effective ? "Remove from favorites" : "Add to favorites"}
                    name="favorite"
                    type="submit"
                    value={effective ? "false" : "true"}
                >
                    {effective ? "★" : "☆"}
                </button>
            </form>
        );
    };
}

import type { Remix } from "@remix-run/dom";
import { dom } from "@remix-run/events";
import { on } from "@remix-run/interaction";
import { client } from "~/api.ts";

export namespace Favorite {
    export interface Props {
        favorite: boolean;
        id: string;
    }
}

export function Favorite(this: Remix.Handle, initialProps: Favorite.Props) {
    let id = initialProps.id;
    let favorite = initialProps.favorite;

    let optimistic = favorite;

    on(client.contact.favorite, this.signal, {
        enhance: event => {
            const [params] = event.input;
            if (params.contactId === id) {
                optimistic = event.formData ? event.formData.get("favorite") === "true" : favorite;
                this.update();
            }
        },
    });

    return (props: Favorite.Props) => {
        id = props.id;
        favorite = props.favorite;

        const {
            on: { submit },
            ...action
        } = client.contact.favorite.form({ contactId: id });

        return (
            <form {...action} on={dom.submit(submit)}>
                <button
                    aria-label={optimistic ? "Remove from favorites" : "Add to favorites"}
                    name="favorite"
                    type="submit"
                    value={optimistic ? "false" : "true"}
                >
                    {optimistic ? "★" : "☆"}
                </button>
            </form>
        );
    };
}

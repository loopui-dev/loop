import type { Remix } from "@remix-run/dom";
import { routes } from "~/routes.ts";
import { RestfulForm } from "./RestfulForm.tsx";

export function Favorite(this: Remix.Handle, initialProps: { favorite: boolean }) {
    let favorite: boolean | null = initialProps.favorite;

    const enhance = RestfulForm.enhance(({ detail: formData }) => {
        favorite = formData.get("favorite") === "true";
        this.update();
    });

    const settled = RestfulForm.settled(() => {
        favorite = null;
        this.update();
    });

    return (props: { favorite: boolean; id: string }) => {
        const favorited = favorite ?? props.favorite;

        return (
            <RestfulForm
                action={routes.contacts.favorite.href({ contactId: props.id })}
                method={routes.contacts.favorite.method}
                on={[enhance, settled]}
            >
                <button
                    aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                    name="favorite"
                    type="submit"
                    value={favorited ? "false" : "true"}
                >
                    {favorited ? "★" : "☆"}
                </button>
            </RestfulForm>
        );
    };
}

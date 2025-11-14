import type { Remix } from "@remix-run/dom";
import { dom } from "@remix-run/events";
import { on } from "@remix-run/interaction";
import { Router } from "~/lib/Router.tsx";
import { Root } from "~/routes/root.tsx";
import { routes } from "~/routes.tsx";

export function SearchBar(this: Remix.Handle) {
    const router = this.context.get(Router);
    on(router, this.signal, {
        navigate: () => this.update(),
        navigatesuccess: () => this.update(),
    });

    return () => {
        const { query } = this.context.get(Root);
        const searching = router.navigating.to.url?.searchParams.has("q");

        return (
            <form action={routes.index.href()} id="search-form" method="get">
                <input
                    aria-label="Search contacts"
                    class={searching ? "loading" : undefined}
                    defaultValue={query ?? ""}
                    id="q"
                    name="q"
                    on={dom.input(event => {
                        if (event.currentTarget.value) {
                            router.searchParams.set("q", event.currentTarget.value, {
                                history: query !== undefined ? "replace" : "auto",
                            });
                        } else {
                            router.searchParams.delete("q");
                        }
                    })}
                    placeholder="Search"
                    type="search"
                />
                <div aria-hidden hidden={!searching} id="search-spinner" />
                <div aria-live="polite" class="sr-only" />
            </form>
        );
    };
}

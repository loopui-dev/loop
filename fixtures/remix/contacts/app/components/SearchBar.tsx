import type { Remix } from "@remix-run/dom";
import { dom } from "@remix-run/events";
import { on } from "@remix-run/interaction";
import { Router } from "~/lib/Router.tsx";
import { Root } from "~/routes/root.tsx";
import { routes } from "~/routes.tsx";

export function SearchBar(this: Remix.Handle) {
    let navigator = this.context.get(Router);
    on(navigator, this.signal, { statechange: () => this.update() });

    return () => {
        let { query } = this.context.get(Root);
        let searching = navigator.navigating.to.url?.searchParams.has("q");

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
                            navigator.searchParams.set("q", event.currentTarget.value, {
                                history: query !== undefined ? "replace" : "auto",
                            });
                        } else {
                            navigator.searchParams.delete("q");
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

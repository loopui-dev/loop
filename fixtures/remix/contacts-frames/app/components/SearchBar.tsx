import type { Remix } from "@remix-run/dom";
import { dom } from "@remix-run/events";
import { on } from "~/lib/on.ts";
import { Router } from "~/lib/Router.tsx";
import { routes } from "~/routes.ts";
import { RestfulForm } from "./RestfulForm.tsx";

export function SearchBar(this: Remix.Handle) {
    const router = this.context.get(Router);
    on(router, this.signal, { statechange: () => this.update() });

    const handleInput = dom.input<HTMLInputElement>(event => {
        // Remove empty query params when value is empty
        if (!event.currentTarget.value) {
            router.searchParams.delete("q");
            return;
        }

        const isFirstSearch = router.searchParams.get("q") === undefined;

        // Performs a client-side navigation
        router.searchParams.set("q", event.currentTarget.value, {
            history: isFirstSearch ? "replace" : "auto",
        });
    });

    return () => {
        const query = router.searchParams.get("q") ?? undefined;
        const searching = Boolean(router.navigating.to.url?.searchParams.has("q"));

        <RestfulForm
            action={routes.contacts.index.href()}
            id="search-form"
            method={routes.contacts.index.method}
        >
            <input
                aria-label="Search contacts"
                class={searching ? "loading" : undefined}
                defaultValue={query}
                id="q"
                name="q"
                on={handleInput}
                placeholder="Search"
                type="search"
            />
            <div aria-hidden hidden={!searching} id="search-spinner" />
            <div aria-live="polite" class="sr-only" />
        </RestfulForm>;
    };
}

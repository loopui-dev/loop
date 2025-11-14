import type { Remix } from "@remix-run/dom";
import { on } from "@remix-run/interaction";
import { client } from "~/api.ts";
import { Details } from "~/components/Details.tsx";
import { SearchBar } from "~/components/SearchBar.tsx";
import { Sidebar } from "~/components/Sidebar.tsx";

export function Root(this: Remix.Handle<{ query?: string }>) {
    const pending = {
        list: true,
        show: true,
    };

    on(client.contact.list, this.signal, {
        fetch: () => {
            pending.list = false;
            this.update();
        },
    });

    on(client.contact.show, this.signal, {
        fetch: () => {
            pending.show = false;
            this.update();
        },
    });

    return (props: { query?: string }) => {
        this.context.set({ query: props.query });
        const allSettled = !pending.list && !pending.show;

        if (!allSettled) {
            return <p class="loading">Loading...</p>;
        }

        return (
            <>
                <div id="sidebar">
                    <h1>Remix Contacts</h1>
                    <div>
                        <SearchBar />
                        <form {...client.contact.create.form}>
                            <button type="submit">New</button>
                        </form>
                    </div>
                    <Sidebar />
                </div>
                <Details />
            </>
        );
    };
}

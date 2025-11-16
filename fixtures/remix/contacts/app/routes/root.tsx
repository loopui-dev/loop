import type { Remix } from "@remix-run/dom";
import { client } from "~/client.ts";
import { Details } from "~/components/Details.tsx";
import { SearchBar } from "~/components/SearchBar.tsx";
import { Sidebar } from "~/components/Sidebar.tsx";

export function Root(this: Remix.Handle<{ query?: string }>) {
    return (props: { query?: string }) => {
        this.context.set({ query: props.query });

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

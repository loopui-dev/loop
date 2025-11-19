import { Catch } from "@remix-run/dom";
import { routes } from "~/routes.ts";
import { Details } from "./components/Details.tsx";
import { RestfulForm } from "./components/RestfulForm.tsx";
import { SearchBar } from "./components/SearchBar.tsx";
import { Sidebar } from "./components/Sidebar.tsx";
import { ErrorBoundary } from "./ErrorBoundary.tsx";

import "./index.css";

export function Root() {
    return (
        <Catch fallback={error => <ErrorBoundary error={error} />}>
            <div id="sidebar">
                <h1>Remix Contacts</h1>
                <div>
                    <SearchBar />
                    <RestfulForm
                        action={routes.contacts.create.href()}
                        method={routes.contacts.create.method}
                    >
                        <button type="submit">New</button>
                    </RestfulForm>
                </div>
                <Sidebar />
            </div>
            <Details />
        </Catch>
    );
}

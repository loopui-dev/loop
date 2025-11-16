import type { Remix } from "@remix-run/dom";
import { on } from "@remix-run/interaction";
import { Router } from "~/lib/Router.tsx";

export function Details(this: Remix.Handle) {
    let navigator = this.context.get(Router);
    on(navigator, this.signal, { statechange: () => this.update() });

    return () => (
        <div
            class={navigator.navigating.to.state === "loading" ? "loading" : undefined}
            id="detail"
        >
            {navigator.outlet}
        </div>
    );
}

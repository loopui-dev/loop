import type { Remix } from "@remix-run/dom";
import { on } from "@remix-run/interaction";
import { Router } from "~/lib/Router.tsx";

export function Details(this: Remix.Handle) {
    let router = this.context.get(Router);
    on(router, this.signal, {
        navigate: () => this.update(),
        navigatesuccess: () => this.update(),
    });

    return () => (
        <div class={router.navigating.to.state === "loading" ? "loading" : undefined} id="detail">
            {router.outlet}
        </div>
    );
}

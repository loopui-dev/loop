import type { AppHandlers } from "@loopui/navigator";
import { Navigator } from "@loopui/navigator";
import type { Remix } from "@remix-run/dom";
import { on } from "@remix-run/interaction";

export namespace Router {
    export interface Props<Routes extends { __defs: unknown }> {
        routes: Routes;
        children: AppHandlers<Routes, Remix.RemixNode>;
        fallback?: Remix.RemixNode;
    }
}

export function Router<Routes extends { __defs: unknown }>(
    this: Remix.Handle<Navigator<Remix.RemixNode>>,
    { routes, children, fallback }: Router.Props<Routes>,
) {
    let navigator = new Navigator<Remix.RemixNode>();
    navigator.map(routes, children);

    let outlet = navigator.outlet;
    on(navigator, this.signal, {
        currententrychange: event => {
            outlet = event.outlet;
            this.update();
        },
    });

    let loading = true;
    this.queueTask(async () => {
        await navigator.ready;
        loading = false;
        this.update();
    });

    this.context.set(navigator);

    return () => {
        if (loading) return fallback;
        return outlet;
    };
}

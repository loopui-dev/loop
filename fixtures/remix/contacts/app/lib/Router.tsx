import type { AppHandlers } from "@loopui/dom-router";
import { Router as DOMRouter } from "@loopui/dom-router";
import type { Remix } from "@remix-run/dom";
import { on } from "@remix-run/interaction";

export function Router<Routes extends { __defs: unknown }>(
    this: Remix.Handle<Router.Handle>,
    { routes, children, fallback }: Router.Props<Routes>,
) {
    const handle = new Router.Handle();
    handle.map(routes, children);

    let outlet = handle.outlet;
    on(handle, this.signal, {
        currententrychange: event => {
            outlet = event.outlet;
            this.update();
        },
    });

    let loading = true;
    this.queueTask(async () => {
        await handle.ready;
        loading = false;
        this.update();
    });

    this.context.set(handle);

    return () => {
        if (loading) return fallback;
        return outlet;
    };
}

export namespace Router {
    export class Handle extends DOMRouter<Remix.RemixNode> {}

    export interface Props<Routes extends { __defs: unknown }> {
        routes: Routes;
        children: AppHandlers<Routes, Remix.RemixNode>;
        fallback?: Remix.RemixNode;
    }
}

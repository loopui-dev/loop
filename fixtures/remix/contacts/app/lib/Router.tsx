import type { AppHandlers } from "@loopui/dom-router";
import { Router as ViewRouter } from "@loopui/dom-router";
import type { Remix } from "@remix-run/dom";
import { on } from "@remix-run/interaction";

export function Router<Routes extends { __defs: unknown }>(
    this: Remix.Handle<Router.Handle>,
    initialProps: { routes: Routes; children: AppHandlers<Routes, Remix.RemixNode> },
) {
    const handle = new Router.Handle();
    handle.map(initialProps.routes, initialProps.children);

    let outlet = handle.outlet;
    on(handle, this.signal, {
        currententrychange: event => {
            outlet = event.outlet;
            this.update();
        },
    });

    this.context.set(handle);

    return () => outlet;
}

export namespace Router {
    export class Handle extends ViewRouter<Remix.RemixNode> {}
}

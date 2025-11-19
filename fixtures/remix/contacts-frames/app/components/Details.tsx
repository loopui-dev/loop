import { Frame, type Remix } from "@remix-run/dom";
import { assert } from "@std/assert";
import { on } from "~/lib/on.ts";
import { Router } from "~/lib/Router.tsx";
import { routes } from "~/routes.ts";

const frames = [
    { route: routes.contacts.index, frame: routes.frames.index },
    { route: routes.contacts.show, frame: routes.frames.show },
    { route: routes.contacts.edit, frame: routes.frames.edit },
];

export function Details(this: Remix.Handle) {
    const router = this.context.get(Router);
    on(router, this.signal, { statechange: () => this.update() });
    let src: string | undefined;

    return () => {
        for (const { route, frame } of frames) {
            const match = route.match(router.url);
            if (match) {
                src = frame.href(match.params);
                break;
            }
        }

        assert(src, "forgot to add route match to <Details />");

        return (
            <div
                class={router.navigating.to.state === "loading" ? "loading" : undefined}
                id="detail"
            >
                <Frame src={src} />
            </div>
        );
    };
}

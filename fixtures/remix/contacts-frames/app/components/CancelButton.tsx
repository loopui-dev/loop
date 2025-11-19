import type { Remix } from "@remix-run/dom";
import { press } from "@remix-run/events/press";
import { Router } from "~/lib/Router.tsx";

export function CancelButton(this: Remix.Handle) {
    const router = this.context.get(Router);

    return () => (
        <button on={press(() => router.back())} type="button">
            Cancel
        </button>
    );
}

import type { TypedEventTarget } from "@remix-run/interaction";
import "@types/dom-navigation";

declare global {
    declare const navigation: Navigation & TypedEventTarget<NavigationEventMap>;

    interface Window {
        readonly navigation: Navigation & TypedEventTarget<NavigationEventMap>;
    }
}

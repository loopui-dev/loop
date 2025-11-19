export {
    // capture,
    createContainer,
    type Dispatched,
    defineInteraction,
    type EventListeners,
    type EventsContainer,
    type InteractionSetup,
    // listenWith,
    // on,
    // type TypedEventTarget,
} from "@remix-run/interaction";
// re-export as a non-type export so it can be subclassed
export { TypedEventTarget } from "../../../node_modules/@remix-run/interaction/src/lib/interaction.ts";

// export * from "./event-iterator.ts";

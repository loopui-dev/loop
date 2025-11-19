import { createContainer, type EventListeners } from "@remix-run/interaction";

export function on<target extends EventTarget>(
    target: target,
    signal: AbortSignal,
    listeners: EventListeners<target>,
): () => void {
    let container = createContainer(target, { signal });
    container.set(listeners);
    return container.dispose;
}

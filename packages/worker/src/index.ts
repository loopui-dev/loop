import { TypedEventTarget } from "@loopui/interaction";

interface RegistryEventMap {
    registered: RegistryEvent;
}

class RegistryEvent extends Event {
    readonly name: keyof RegistryEventMap;
    constructor(name: keyof RegistryEventMap) {
        super(name);
        this.name = name;
    }
}

export class WorkerRegistry extends TypedEventTarget<RegistryEventMap> {
    #entry: string;

    /**
     * @default "/entry.worker.js"
     */
    constructor(entry?: string) {
        super();
        this.#entry = entry ?? "/entry.worker.js";
    }

    async register() {
        if (!navigator.serviceWorker.controller) {
            await navigator.serviceWorker.register(this.#entry, { type: "module" });
            window.location.reload();
        } else {
            this.dispatchEvent(new RegistryEvent("registered"));
        }
    }
}

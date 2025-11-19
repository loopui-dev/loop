import { TypedEventTarget } from "@loopui/events";
import type { Remix } from "@remix-run/dom";
import { createRouter, type RouteHandlers, type RouteMap } from "@remix-run/fetch-router";
import { on } from "./on.ts";

export function Router<TRouteMap extends RouteMap>(
    this: Remix.Handle<Router.Handle>,
    initialProps: Router.Props<TRouteMap>,
) {
    const router = createRouter();
    router.map(initialProps.routes, initialProps.handlers);

    const handle = new Router.Handle(router);

    const render = async (url: URL, formData: FormData | null, signal?: AbortSignal) => {
        const currentState: Router.Navigation = {
            state: "idle" as const,
            url: undefined,
            formData: undefined,
        };

        handle.set({
            navigating: {
                from: currentState,
                to: formData
                    ? { state: "submitting", url, formData }
                    : { state: "loading", url, formData: undefined },
            },
        });

        const request = new Request(url, {
            method: formData ? "POST" : "GET",
            body: formData,
        });

        let result = await router.fetch(request, { signal });
        if (signal?.aborted) return;

        let outlet: Remix.RemixNode;

        // If handler returned a Response, handle it
        if (result instanceof Response) {
            if (!result.ok) return;

            // Handle redirects
            while (result.status >= 300 && result.status < 400) {
                const location = result.headers.get("Location");
                if (!location) break;

                const redirectUrl = new URL(location, url);
                const redirectRequest = new Request(redirectUrl);
                result = await router.fetch(redirectRequest, { signal });
                if (signal?.aborted) return;
            }

            // Extract outlet from JSON response
            outlet = (await result.json()) as Remix.RemixNode;
        } else {
            // Handler returned RemixNode directly
            outlet = result as Remix.RemixNode;
        }

        // TODO: Extract params from matched route
        // Extract params from the URL by matching against routes
        const params = new Map<string, string>();

        handle.set({
            outlet,
            url: new URL(url),
            params,
            navigating: {
                from: {
                    state: "idle",
                    url: undefined,
                    formData: undefined,
                },
                to: {
                    state: "idle",
                    url: undefined,
                    formData: undefined,
                },
            },
        });

        // TODO: Cache the previous RemixNode so that we only do a top-down
        // update when the page component changes, otherwise let child components
        // subscribe to fine-grained updates
        this.update();
    };

    on(navigation, this.signal, {
        navigate(event) {
            event.intercept({
                handler() {
                    const url = new URL(event.destination.url);
                    return render(url, event.formData, event.signal);
                },
            });
        },
    });

    this.context.set(handle);

    let isLoading = true;

    this.queueTask(async signal => {
        await render(handle.url, null, signal);
        isLoading = false;
        this.update();
    });

    return () => {
        if (isLoading || !handle.outlet) {
            return initialProps.fallback;
        }

        return handle.outlet;
    };
}

export namespace Router {
    export interface Props<TRouteMap extends RouteMap> {
        routes: TRouteMap;
        handlers: RouteHandlers<TRouteMap>;
        fallback?: Remix.RemixNode;
    }

    export interface NavigationOptions {
        history?: "auto" | "push" | "replace";
    }

    /** Fine-grained navigation states the router can report. */
    export interface NavigationStates {
        Idle: {
            state: "idle";
            url: undefined;
            formData: undefined;
        };
        Loading: {
            state: "loading";
            url: URL;
            formData: undefined;
        };
        Submitting: {
            state: "submitting";
            url: URL;
            formData: FormData;
        };
    }
    /** Union of all navigation states exposed via {@link Navigating}. */
    export type Navigation = NavigationStates[keyof NavigationStates];

    /** Pair of navigation states describing where the router is coming from and going to. */
    export interface Navigating {
        to: Navigation;
        from: Navigation;
    }

    export interface State {
        readonly outlet: Remix.RemixNode;
        readonly url: URL;
        readonly navigating: Router.Navigating;
        readonly params: Router.Params;
        readonly searchParams: Router.SearchParams;
    }

    export class StateChangeEvent extends Event implements Router.State {
        readonly outlet: Remix.RemixNode;
        readonly url: URL;
        readonly navigating: Router.Navigating;
        readonly params: Router.Params;
        readonly searchParams: Router.SearchParams;

        constructor(
            outlet: Remix.RemixNode,
            url: URL,
            navigating: Router.Navigating,
            params: Router.Params,
            searchParams: Router.SearchParams,
        ) {
            super("statechange");

            this.outlet = outlet;
            this.url = url;
            this.navigating = navigating;
            this.params = params;
            this.searchParams = searchParams;
        }
    }

    export interface EventMap {
        statechange: StateChangeEvent;
    }

    export interface NavigationHistoryEntry extends EventTarget {
        readonly key: string;
        readonly id: string;
        readonly url: string | null;
        readonly index: number;
        readonly sameDocument: boolean;
    }

    export interface NavigationResult {
        committed: Promise<NavigationHistoryEntry>;
        finished: Promise<NavigationHistoryEntry>;
    }

    export class Handle extends TypedEventTarget<EventMap> implements Router.State {
        #outlet: Remix.RemixNode = null;
        #url: URL = new URL(window.location.href);
        #navigating: Router.Navigating = {
            from: { state: "idle", url: undefined, formData: undefined },
            to: { state: "idle", url: undefined, formData: undefined },
        };
        #params: Router.Params = new Map();
        #searchParams: Router.SearchParams = new Router.SearchParams();
        #router: ReturnType<typeof createRouter>;

        /** @private */
        constructor(router: ReturnType<typeof createRouter>) {
            super();
            this.#router = router;
        }

        /** @private */
        set(state: Partial<Router.State>): void {
            if (state.outlet !== undefined) this.#outlet = state.outlet;
            if (state.url !== undefined) {
                this.#url = state.url;
                this.#searchParams = new Router.SearchParams(state.url.searchParams);
            }
            if (state.navigating !== undefined) this.#navigating = state.navigating;
            if (state.params !== undefined) this.#params = state.params;
            if (state.searchParams !== undefined) this.#searchParams = state.searchParams;

            this.dispatchEvent(
                new Router.StateChangeEvent(
                    this.#outlet,
                    this.#url,
                    this.#navigating,
                    this.#params,
                    this.#searchParams,
                ),
            );
        }

        get outlet(): Remix.RemixNode {
            return this.#outlet;
        }

        get url(): URL {
            return this.#url;
        }

        get navigating(): Router.Navigating {
            return this.#navigating;
        }

        get params(): Router.Params {
            return this.#params;
        }

        get searchParams(): Router.SearchParams {
            return this.#searchParams;
        }

        async fetch(url: string | URL, init?: RequestInit): Promise<Response> {
            const request = new Request(url, init);
            return this.#router.fetch(request);
        }

        navigate(url: string | URL, options?: NavigationOptions): NavigationResult {
            const targetUrl = new URL(url, window.location.href);
            return navigation.navigate(targetUrl.href, {
                history: options?.history ?? "auto",
            });
        }

        submit(
            submitter: HTMLFormElement | HTMLButtonElement,
            options?: NavigationOptions,
        ): NavigationResult;
        submit(
            action: string | URL,
            formData: FormData,
            options?: NavigationOptions,
        ): NavigationResult;
        submit(
            action: string | URL | HTMLFormElement | HTMLButtonElement,
            formDataOrOptions?: FormData | NavigationOptions,
            options?: NavigationOptions,
        ): NavigationResult {
            let targetUrl: URL;
            let formData: FormData;
            let navOptions: NavigationOptions | undefined;

            if (action instanceof HTMLFormElement) {
                targetUrl = new URL(action.action, window.location.href);
                formData = new FormData(action);
                navOptions = formDataOrOptions as NavigationOptions | undefined;
            } else if (action instanceof HTMLButtonElement) {
                const form = action.form;
                if (!form) throw new Error("Button must be associated with a form");
                targetUrl = new URL(action.formAction || form.action, window.location.href);
                formData = new FormData(form);
                if (action.name && action.value) {
                    formData.append(action.name, action.value);
                }
                navOptions = formDataOrOptions as NavigationOptions | undefined;
            } else {
                targetUrl = new URL(action, window.location.href);
                formData = formDataOrOptions as FormData;
                navOptions = options;
            }

            return navigation.navigate(targetUrl.href, {
                history: navOptions?.history ?? "auto",
                info: { formData },
            });
        }

        reload(options?: NavigationOptions): NavigationResult {
            return navigation.reload({
                info: options,
            });
        }

        traverseTo(key: string): NavigationResult {
            return navigation.traverseTo(key);
        }

        back(): NavigationResult {
            return navigation.back();
        }

        forward(): NavigationResult {
            return navigation.forward();
        }

        /**
         * Check if a path is currently active.
         * Supports partial matching - e.g., isActive("/blog") returns true for "/blog/post/1"
         * @param path - The path to check
         * @param exact - If true, requires exact match. Default is false (partial match)
         */
        isActive(path: string | URL | undefined, exact = false): boolean {
            if (!path) return false;
            const targetPath = typeof path === "string" ? path : path.pathname + path.search;
            const currentPath = this.#url.pathname + this.#url.search;

            if (exact) {
                return currentPath === targetPath;
            }
            return currentPath.startsWith(targetPath);
        }

        /**
         * Check if a path is currently pending navigation.
         * Supports partial matching - e.g., isPending("/blog") returns true when navigating to "/blog/post/1"
         * @param path - The path to check
         * @param exact - If true, requires exact match. Default is false (partial match)
         */
        isPending(path: string | URL | undefined, exact = false): boolean {
            if (!path) return false;
            const navState = this.#navigating.to;
            if (navState.state === "idle") return false;

            const targetPath = typeof path === "string" ? path : path.pathname + path.search;
            const pendingPath = navState.url.pathname + navState.url.search;

            if (exact) {
                return pendingPath === targetPath;
            }
            return pendingPath.startsWith(targetPath);
        }

        /**
         * Helper method that returns different values based on whether a path is active or pending.
         * Useful for conditional rendering or styling.
         *
         * @param path - The path to check
         * @param options - Object with `active` and `pending` values to return
         * @returns The `active` value if path is active, `pending` value if path is pending, or undefined otherwise
         *
         * @example
         * ```ts
         * let className = router.when("/dashboard", {
         *   active: "text-blue-600 font-bold",
         *   pending: "text-gray-400 animate-pulse"
         * });
         * ```
         */
        when<const T>(
            path: string | URL | undefined,
            options: { active: T; pending?: undefined },
        ): T | undefined;
        when<const U>(
            path: string | URL | undefined,
            options: { active?: undefined; pending: U },
        ): U | undefined;
        when<const T, const U>(
            path: string | URL | undefined,
            options: { active: T; pending: U },
        ): T | U | undefined;
        when(path: string | URL | undefined): {
            active: boolean;
            pending: boolean;
        };
        when<const T, const U>(
            path: string | URL | undefined,
            options?: { active?: T; pending?: U },
        ): { active: boolean; pending: boolean } | T | U | undefined {
            const active = this.isActive(path);
            const pending = this.isPending(path);

            if (!options) {
                return { active, pending };
            }

            if (active && options.active !== undefined) {
                return options.active;
            }
            if (pending && options.pending !== undefined) {
                return options.pending;
            }
            return undefined;
        }
    }

    export type Params = ReadonlyMap<string, string>;

    export class SearchParams extends URLSearchParams {
        override set(name: string, value: string, options?: Router.NavigationOptions): void {
            const url = new URL(window.location.href);
            url.searchParams.set(name, value);
            navigation.navigate(url.href, {
                history: options?.history ?? "auto",
            });
        }

        override append(name: string, value: string, options?: Router.NavigationOptions): void {
            const url = new URL(window.location.href);
            url.searchParams.append(name, value);
            navigation.navigate(url.href, {
                history: options?.history ?? "auto",
            });
        }

        override delete(name: string, value?: string, options?: Router.NavigationOptions): void;
        override delete(name: string, options?: Router.NavigationOptions): void;
        override delete(
            name: string,
            valueOrOptions?: string | Router.NavigationOptions,
            options?: Router.NavigationOptions,
        ): void {
            const url = new URL(window.location.href);

            if (typeof valueOrOptions === "string") {
                url.searchParams.delete(name, valueOrOptions);
                navigation.navigate(url.href, {
                    history: options?.history ?? "auto",
                });
            } else {
                url.searchParams.delete(name);
                navigation.navigate(url.href, {
                    history: valueOrOptions?.history ?? "auto",
                });
            }
        }
    }
}

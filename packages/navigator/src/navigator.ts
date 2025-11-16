import { TypedEventTarget } from "@loopui/interaction";
import type { AppHandlers } from "./handlers.ts";
import { todo } from "./index.ts";

type NavigationNavigateEvent = NavigateEvent;
type DOMNavigation = Omit<
    Navigation,
    | "addEventListener"
    | "removeEventListener"
    | "onnavigate"
    | "onnavigatesuccess"
    | "onnavigateerror"
    | "oncurrententrychange"
>;
type DOMErrorEvent = ErrorEvent;

export class Navigator<Renderable = unknown>
    extends TypedEventTarget<Navigator.EventMap<Renderable>>
    implements DOMNavigation
{
    // Navigation API properties mirrored from window.navigation
    currentEntry: NavigationHistoryEntry | null = todo();
    transition: NavigationTransition | null = todo();
    canGoBack: boolean = todo();
    canGoForward: boolean = todo();

    /**
     * The current location as a URL object.
     * Provides convenient access to search params and other URL properties.
     */
    url: URL = todo();

    /**
     * Current navigation status, including the route being left and the route being entered.
     * This is useful for rendering loading indicators or optimistic UI.
     */
    navigating: Navigator.Navigating = todo();

    /**
     * The latest rendered node returned by the matched route handler.
     * Consumers can mount this node inside their application's root.
     */
    outlet: Renderable | null = todo();

    params: Navigator.Params = todo();

    searchParams: Navigator.SearchParams = todo();

    ready: Promise<boolean> = todo();

    // Navigation API methods mirrored from window.navigation
    navigate(_url: string, _options?: NavigationNavigateOptions): NavigationResult {
        todo();
    }

    reload(_options?: NavigationReloadOptions): NavigationResult {
        todo();
    }

    traverseTo(_key: string, _options?: NavigationOptions): NavigationResult {
        todo();
    }

    back(_options?: NavigationOptions): NavigationResult {
        todo();
    }

    forward(_options?: NavigationOptions): NavigationResult {
        todo();
    }

    updateCurrentEntry(_options: NavigationUpdateCurrentEntryOptions): void {
        todo();
    }

    entries(): NavigationHistoryEntry[] {
        todo();
    }

    /**
     * Check if a path is currently active.
     * Supports partial matching - e.g., isActive("/blog") returns true for "/blog/post/1"
     * @param path - The path to check
     * @param exact - If true, requires exact match. Default is false (partial match)
     */
    isActive(_path: string | URL | Partial<Navigator.Path> | undefined, _exact?: boolean): boolean {
        todo();
    }

    /**
     * Check if a path is currently pending navigation.
     * Supports partial matching - e.g., isPending("/blog") returns true when navigating to "/blog/post/1"
     * @param path - The path to check
     * @param exact - If true, requires exact match. Default is false (partial match)
     */
    isPending(
        _path: string | URL | Partial<Navigator.Path> | undefined,
        _exact?: boolean,
    ): boolean {
        todo();
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
        path: string | URL | Partial<Navigator.Path> | undefined,
        options: { active: T; pending?: undefined },
    ): T | undefined;
    when<const U>(
        path: string | URL | Partial<Navigator.Path> | undefined,
        options: { active?: undefined; pending: U },
    ): U | undefined;
    when<const T, const U>(
        path: string | URL | Partial<Navigator.Path> | undefined,
        options: { active: T; pending: U },
    ): T | U | undefined;
    when(path: string | URL | Partial<Navigator.Path> | undefined): {
        active: boolean;
        pending: boolean;
    };
    when<const T, const U>(
        _path: string | URL | Partial<Navigator.Path> | undefined,
        _options?: { active?: T; pending?: U },
    ): { active: boolean; pending: boolean } | T | U | undefined {
        todo();
    }

    /**
     * Map routes and handlers together.
     * @param routes The route map
     * @param handlers The handlers that correspond to the routes
     */
    map<Routes extends { __defs: unknown }>(_routes: Routes, _handlers: AppHandlers<Routes>): void {
        todo();
    }
}

export namespace Navigator {
    export interface NavigateEvent extends NavigationNavigateEvent {}
    export interface SuccessEvent extends Event {}
    export interface ErrorEvent extends DOMErrorEvent {}
    export interface CurrentEntryChangeEvent<Renderable = unknown> extends Event {
        navigationType: NavigationTypeString | null;
        from: NavigationHistoryEntry;
        outlet: Renderable;
    }

    export interface EventMap<Renderable = unknown> extends NavigationEventMap {
        navigate: Navigator.NavigateEvent;
        navigatesuccess: Navigator.SuccessEvent;
        navigateerror: Navigator.ErrorEvent;
        currententrychange: Navigator.CurrentEntryChangeEvent<Renderable>;
        statechange: Navigator;
    }

    /** Parsed representation of a URL used by the router helpers. */
    export interface Path {
        /**
         * A URL pathname, beginning with a /.
         */
        pathname: string;
        /**
         * A URL search string, beginning with a ?.
         */
        search: string;
        /**
         * A URL fragment identifier, beginning with a #.
         */
        hash: string;
    }

    /** Fine-grained navigation states the router can report. */
    export interface NavigationStates {
        Idle: {
            state: "idle";
            location: undefined;
            url: undefined;
        };
        Loading: {
            state: "loading";
            location: Location;
            url: URL;
        };
    }
    /** Union of all navigation states exposed via {@link Navigating}. */
    export type Navigation = NavigationStates[keyof NavigationStates];

    /** Pair of navigation states describing where the router is coming from and going to. */
    export interface Navigating {
        to: Navigation;
        from: Navigation;
    }

    export type Params = ReadonlyMap<string, string>;

    export class SearchParams extends URLSearchParams {
        set(_name: string, _value: string, _options?: NavigationNavigateOptions): void {
            todo();
        }
        append(_name: string, _value: string, _options?: NavigationNavigateOptions): void {
            todo();
        }

        delete(name: string, value?: string, options?: NavigationNavigateOptions): void;
        delete(name: string, options?: NavigationNavigateOptions): void;
        delete(
            _name: string,
            _valueOrOptions?: string | NavigationNavigateOptions,
            _options?: NavigationNavigateOptions,
        ): void {
            todo();
        }
    }
}

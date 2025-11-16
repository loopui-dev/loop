import type {
    Middleware,
    RequestHandler,
    RequestMethod,
    Route,
    RouteDefs,
    RouteMap,
} from "@remix-run/fetch-router";
import { json as fetchRouterJson } from "@remix-run/fetch-router/response-helpers";
import type { HrefBuilderArgs } from "@remix-run/route-pattern";

export type RouteHandlers<routes extends RouteMap> =
    | RouteHandlersWithMiddleware<routes>
    | {
          [name in keyof routes]: routes[name] extends Route<
              infer method extends RequestMethod | "ANY",
              infer pattern extends string
          >
              ? RouteHandler<method, pattern>
              : routes[name] extends RouteMap
                ? RouteHandlers<routes[name]>
                : never;
      };

export type RouteHandlersWithMiddleware<routes extends RouteMap> = {
    middleware: Middleware[];
    handlers: RouteHandlers<routes>;
};

export type RouteHandler<method extends RequestMethod | "ANY", pattern extends string> =
    | RequestHandlerWithMiddleware<method, pattern>
    | RequestHandler<method, HrefParams.Output<pattern>>;

export type RequestHandlerWithMiddleware<
    method extends RequestMethod | "ANY",
    pattern extends string,
> = {
    middleware: Middleware<method, HrefParams.Output<pattern>>[];
    handler: RequestHandler<method, HrefParams.Output<pattern>>;
};

export type ParamValue = string | number | bigint | boolean;

export namespace HrefParams {
    export type Input<T extends string> =
        HrefBuilderArgs<T> extends [infer P extends Record<string, any>, ...any[]] ? P : never;

    export type Output<T extends string> = T extends `${infer _Start}:${infer Param}/${infer Rest}`
        ? { [K in Param | keyof HrefParams.Output<Rest>]: string }
        : T extends `${infer _Start}:${infer Param}`
          ? { [K in Param]: string }
          : {};

    // Build RouteMap from route definitions
    type BuildRoute<def> = def extends string
        ? RouteHelper<HrefParams.Input<def>>
        : def extends { pattern: infer pattern extends string }
          ? RouteHelper<HrefParams.Input<pattern>> &
                (def extends { children: infer children }
                    ? children extends RouteDefs
                        ? BuildRouteMap<children>
                        : {}
                    : {})
          : def extends RouteDefs
            ? BuildRouteMap<def>
            : never;

    type BuildRouteMap<defs extends RouteDefs> = {
        -readonly [name in keyof defs]: BuildRoute<defs[name]>;
    };

    // Route helper with href method
    interface RouteHelper<Params extends Record<string, string> = {}> {
        href(params?: Params extends Record<string, never> ? void : Params): string;
    }
}

export namespace HrefSearchParams {
    export type Input<T extends string> = T extends `${string}?${infer SearchString}`
        ? ParseSearchParamsInput<SearchString>
        : {};

    // Extract search params from pattern by looking for ?... syntax
    export type Output<T extends string> = T extends `${string}?${infer SearchString}`
        ? ParseSearchParams<SearchString>
        : {};

    // Parse search param names from search string like "q" or "q&foo=bar"
    type ParseSearchParams<S extends string> = S extends `${infer Name}&${infer Rest}`
        ? ParseSearchParam<Name> & ParseSearchParams<Rest>
        : ParseSearchParam<S>;

    // Parse a single search param declaration
    type ParseSearchParam<S extends string> = S extends `${infer Name}=${string}`
        ? { [K in Name]?: string }
        : S extends string
          ? { [K in S]?: string }
          : {};

    // Parse search param names from search string like "q" or "q&foo=bar"
    type ParseSearchParamsInput<S extends string> = S extends `${infer Name}&${infer Rest}`
        ? ParseSearchParamInput<Name> & ParseSearchParamsInput<Rest>
        : ParseSearchParamInput<S>;

    // Parse a single search param declaration
    type ParseSearchParamInput<S extends string> = S extends `${infer Name}=${string}`
        ? { [K in Name]?: ParamValue }
        : S extends string
          ? { [K in S]?: ParamValue }
          : {};
}

// A thin typed wrapper over whatever fetch-router's Response actually is
export interface TypedResponse<T = unknown> extends Response {
    // purely at the type level
    readonly _data?: T;
}

export function json<T>(data: T, init?: ResponseInit): TypedResponse<T> {
    return fetchRouterJson(data, init) as TypedResponse<T>;
}

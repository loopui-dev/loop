import type { HrefParams, HrefSearchParams } from "@loopui/fetch-router";
import type { RoutePattern } from "@remix-run/route-pattern";
import { todo } from "./index.ts";

export class RouteContext<Pattern extends string = string> {
    url: URL = todo();
    params: HrefParams.Output<Pattern> = todo();
    searchParams: HrefSearchParams.Output<Pattern> = todo();
}

export type RouteDef = string | { pattern: string; children?: RouteDefs };

export interface RouteDefs {
    [name: string]: RouteDef | RouteDefs;
}

export interface RouteHandler<Renderable = unknown> {
    preload?: (context: RouteContext) => void | Promise<void>;
    render?: ((context: RouteContext) => Renderable) | (() => Renderable);
    children?: RouteHandlers<Renderable>;
}

export interface RouteHandlers<Renderable = unknown> {
    [name: string]: RouteHandler<Renderable> | RouteHandlers<Renderable>;
}

export interface RouteMap {
    [name: string]: RoutePattern<any> | RouteMap;
}

// Build RouteMap from route definitions
type BuildRoute<Def> = Def extends string
    ? RoutePattern<Def>
    : Def extends { pattern: infer Pattern extends string }
      ? RoutePattern<Pattern> &
            (Def extends { children: infer children }
                ? children extends RouteDefs
                    ? BuildRouteMap<children>
                    : {}
                : {})
      : Def extends RouteDefs
        ? BuildRouteMap<Def>
        : never;

type BuildRouteMap<Defs extends RouteDefs> = {
    -readonly [name in keyof Defs]: BuildRoute<Defs[name]>;
};

// Special handling: if there's a "root" key with children, flatten children to top level
type FlattenRoot<Defs> = Defs extends { root: infer Root }
    ? Root extends { children: infer children }
        ? children extends RouteDefs
            ? BuildRouteMap<children>
            : {}
        : Defs extends RouteDefs
          ? BuildRouteMap<Defs>
          : {}
    : Defs extends RouteDefs
      ? BuildRouteMap<Defs>
      : {};

export function createRoutes<const Defs extends RouteDefs>(
    defs: Defs,
): FlattenRoot<Defs> & { __defs: Defs } {
    todo();
}

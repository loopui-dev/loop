import type { RouteContext, RouteDefs } from "./routes.ts";

// Extract the route definition structure before flattening
type UnflattenRoot<Defs> = Defs extends { root: infer Root }
    ? Root extends { children: infer children }
        ? children extends RouteDefs
            ? { root: Root }
            : Defs
        : Defs
    : Defs;

export type AppHandlers<Routes, Renderable = unknown> = Routes extends { __defs: infer Defs }
    ? BuildHandlersFromDefs<UnflattenRoot<Defs>, Renderable>
    : never;

type BuildHandlersFromDefs<Defs, Renderable> = {
    [K in keyof Defs]: Defs[K] extends string
        ? {
              preload?: (context: RouteContext<Defs[K]>) => void | Promise<void>;
              render: (context: RouteContext<Defs[K]>) => Renderable | Promise<Renderable>;
              children?: undefined;
          }
        : Defs[K] extends { pattern: infer Pattern extends string }
          ? {
                preload?: (context: RouteContext<Pattern>) => void | Promise<void>;
                render: (context: RouteContext<Pattern>) => Renderable | Promise<Renderable>;
            } & (Defs[K] extends { children: infer Children }
                ? Children extends RouteDefs
                    ? { children: BuildHandlersFromDefs<Children, Renderable> }
                    : {}
                : {})
          : Defs[K] extends RouteDefs
            ? BuildHandlersFromDefs<Defs[K], Renderable>
            : never;
};

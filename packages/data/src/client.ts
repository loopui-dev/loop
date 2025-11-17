import type { HrefParams, HrefSearchParams, RequiredParams, TypedResponse } from "@loopui/server";
import type { RequestMethod, Route } from "@remix-run/fetch-router";
import type { Action } from "./action.ts";
import { todo } from "./index.ts";
import type { Loader } from "./loader.ts";
import type { FormMethod, Json } from "./types.ts";

export type FetchOptions<Method extends RequestMethod | "ANY", Pattern extends string> = [
    RequiredParams<Pattern>,
] extends [never]
    ? Method extends "GET"
        ? {
              params?: HrefParams.Input<Pattern>;
              searchParams?: HrefSearchParams.Input<Pattern>;
              body?: undefined;
          }
        : {
              params?: HrefParams.Input<Pattern>;
              searchParams?: HrefSearchParams.Input<Pattern>;
              body?: Json | FormData | URLSearchParams;
          }
    : Method extends "GET"
      ? {
            params: HrefParams.Input<Pattern>;
            searchParams?: HrefSearchParams.Input<Pattern>;
            body?: undefined;
        }
      : {
            params: HrefParams.Input<Pattern>;
            searchParams?: HrefSearchParams.Input<Pattern>;
            body?: Json | FormData | URLSearchParams;
        };

// Check if type has no keys by testing if it's exactly {}
type IsEmptyObject<T> = {} extends T ? ([keyof T] extends [never] ? true : false) : false;

// A branded type that cannot be instantiated
declare const BRAND: unique symbol;
type Impossible = { [BRAND]: never };

type _Action<Pattern extends string> =
    IsEmptyObject<HrefParams.Input<Pattern>> extends true
        ? Omit<Action<[FormData]>, "with"> & { with(impossible: Impossible): never }
        : Action<[HrefParams.Input<Pattern>, FormData]>;

type HandlerReturn<H> = H extends (...args: any[]) => Promise<TypedResponse<infer T>>
    ? T
    : H extends (...args: any[]) => TypedResponse<infer T>
      ? T
      : any;

type EnhancedRoute<R, H> =
    // GET routes become Loaders with the right Value
    R extends Route<"GET", infer Pattern extends string>
        ? R & Loader<[FetchOptions<"GET", Pattern>], HandlerReturn<H>>
        : R extends Route<FormMethod, infer Pattern extends string>
          ? R & _Action<Pattern>
          : R;

type EnhanceRouteMap<Api, Handlers> = {
    [K in keyof Api]: Api[K] extends Route<any, any>
        ? // Leaf: Api[K] is a Route, Handlers[K] is its handler
          EnhancedRoute<Api[K], K extends keyof Handlers ? Handlers[K] : unknown>
        : Api[K] extends object
          ? // Nested: recurse into both Api[K] and Handlers[K]
            EnhanceRouteMap<Api[K], K extends keyof Handlers ? Handlers[K] : {}>
          : // Anything else just passes through
            Api[K];
};

export function createClient<Api, Handlers>(_routes: Api): EnhanceRouteMap<Api, Handlers> {
    return todo();
}

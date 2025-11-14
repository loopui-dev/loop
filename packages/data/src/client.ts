import type { HrefParams, HrefSearchParams, RequiredParams } from "@loopui/fetch-router";
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
declare const __brand: unique symbol;
type Impossible = { [__brand]: never };

type _Action<Pattern extends string> =
    IsEmptyObject<HrefParams.Input<Pattern>> extends true
        ? Omit<Action<[FormData]>, "with"> & { with(impossible: Impossible): never }
        : Action<[HrefParams.Input<Pattern>, FormData]>;

type EnhancedRoute<R> =
    R extends Route<"GET", infer Pattern extends string>
        ? // TODO: Figure out how to get Loader<_, Value> instead of Loader<_, any>
          R & Loader<[FetchOptions<"GET", Pattern>], any>
        : R extends Route<FormMethod, infer Pattern extends string>
          ? R & _Action<Pattern>
          : R;

type EnhanceRouteMap<T> = {
    [K in keyof T]: T[K] extends Route<any, any>
        ? EnhancedRoute<T[K]>
        : T[K] extends object
          ? EnhanceRouteMap<T[K]>
          : T[K];
};

export function createClient<T>(map: T): EnhanceRouteMap<T> {
    return todo();
}

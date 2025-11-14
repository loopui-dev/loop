import type { RequestMethod } from "@remix-run/fetch-router";

export type NormalizeInput<I> = I extends unknown[] ? I : I extends object ? [I[keyof I]] : never;

export type InputWithoutAbortSignal<T extends readonly unknown[]> = T extends readonly [
    ...infer Head,
    infer Last,
]
    ? Last extends AbortSignal
        ? [...Head, AbortSignal | undefined]
        : T
    : T;

export type InputWithoutFormData<T extends readonly unknown[]> = T extends readonly [
    ...infer Head,
    infer Last,
]
    ? Last extends FormData
        ? Head
        : T
    : T;

export type FormMethod = Exclude<RequestMethod, "GET">;

export type Json = Record<string, unknown>;

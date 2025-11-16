import type { RequestMethod } from "@remix-run/fetch-router";
import { todo } from "./index.ts";

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

export type DataState<Value> =
    | { status: "idle"; value?: undefined; error?: undefined }
    | { status: "pending"; value?: Value; error?: undefined; promise: Promise<Value> }
    | { status: "success"; value: Value; error?: undefined }
    | { status: "error"; value?: Value; error: unknown };

export interface DataEventMap<Input extends unknown[] | object, Value> {
    statechange: DataStateChangeEvent<Input, Value>;
}

export class DataStateChangeEvent<Input extends unknown[] | object, Value> extends Event {
    input: NormalizeInput<Input> = todo();
    current: DataState<Value> = todo();
    previous: DataState<Value> = todo();

    constructor(name: Extract<keyof DataEventMap<Input, Value>, "statechange">) {
        super(name);
        todo();
    }
}

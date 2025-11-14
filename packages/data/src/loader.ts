import { TypedEventTarget } from "@loopui/interaction";
import { todo } from "./index.ts";
import type { InputWithoutAbortSignal, NormalizeInput } from "./types.ts";

export type Status = "idle" | "loading" | "success" | "error" | "stale";

export type LoaderState<Value> =
    | { status: "idle"; value?: undefined; error?: undefined }
    | { status: "pending"; value?: Value; error?: undefined; promise: Promise<Value> }
    | { status: "success"; value: Value; error?: undefined }
    | { status: "error"; value?: Value; error: unknown };

export class LoaderEvent<Input extends unknown[] | object, Value> extends Event {
    input: NormalizeInput<Input> = todo();
    state: LoaderState<Value> = todo();

    constructor(name: Exclude<keyof LoaderEventMap<Input, Value>, "statechange">) {
        super(name);
        todo();
    }
}

export class LoaderStateChangeEvent<Input extends unknown[] | object, Value> extends Event {
    input: NormalizeInput<Input> = todo();
    current: LoaderState<Value> = todo();
    previous: LoaderState<Value> = todo();

    constructor(name: Extract<keyof LoaderEventMap<Input, Value>, "statechange">) {
        super(name);
        todo();
    }
}

export interface LoaderEventMap<Input extends unknown[] | object, Value> {
    statechange: LoaderStateChangeEvent<Input, Value>;
    invalidate: LoaderEvent<Input, Value>;
    refetch: LoaderEvent<Input, Value>;
    fetch: LoaderEvent<Input, Value>;
    evict: LoaderEvent<Input, Value>;
}

export class Loader<Input extends unknown[], Value> extends TypedEventTarget<
    LoaderEventMap<Input, Value>
> {
    key: string = todo();
    keyFor(...input: InputWithoutAbortSignal<Input>): string {
        todo();
    }

    constructor(fetcher: (...input: Input) => Promise<Value>) {
        super();
        todo();
    }

    fetch(...input: InputWithoutAbortSignal<Input>): Promise<Value> {
        todo();
    }
    peek(...input: InputWithoutAbortSignal<Input>): LoaderState<Value> {
        todo();
    }

    refetch(
        ...input: InputWithoutAbortSignal<Input> | InputWithoutAbortSignal<Input>[]
    ): Promise<void> {
        todo();
    }
    invalidate(...input: InputWithoutAbortSignal<Input> | InputWithoutAbortSignal<Input>[]): void {
        todo();
    }
    evict(...input: InputWithoutAbortSignal<Input> | InputWithoutAbortSignal<Input>[]): void {
        todo();
    }
}

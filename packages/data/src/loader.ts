import { TypedEventTarget } from "@loopui/interaction";
import { todo } from "./index.ts";
import type { DataEventMap, DataState, InputWithoutAbortSignal, NormalizeInput } from "./types.ts";

export class LoaderEvent<Input extends unknown[] | object, Value> extends Event {
    input: NormalizeInput<Input> = todo();
    state: DataState<Value> = todo();

    constructor(name: Exclude<keyof LoaderEventMap<Input, Value>, "statechange">) {
        super(name);
        todo();
    }
}

export interface LoaderEventMap<Input extends unknown[] | object, Value>
    extends DataEventMap<Input, Value> {
    invalidate: LoaderEvent<Input, Value>;
    refetch: LoaderEvent<Input, Value>;
    fetch: LoaderEvent<Input, Value>;
    evict: LoaderEvent<Input, Value>;
}

export class Loader<Input extends unknown[], Value> extends TypedEventTarget<
    LoaderEventMap<Input, Value>
> {
    constructor(_fetcher: (...input: Input) => Promise<Value>) {
        super();
        todo();
    }

    fetch<V = Value>(..._input: InputWithoutAbortSignal<Input>): Promise<V> {
        todo();
    }

    refetch(
        ..._input: InputWithoutAbortSignal<Input> | InputWithoutAbortSignal<Input>[]
    ): Promise<void> {
        todo();
    }

    get(..._input: InputWithoutAbortSignal<Input>): DataState<Value> {
        todo();
    }

    filter(
        _predicate: (input: InputWithoutAbortSignal<Input>) => boolean,
    ): Omit<Loader<[], Value>, "fetch" | "refetch" | "get"> & { get(): DataState<Value>[] } {
        todo();
    }

    invalidate(..._input: InputWithoutAbortSignal<Input> | InputWithoutAbortSignal<Input>[]): void {
        todo();
    }

    evict(..._input: InputWithoutAbortSignal<Input> | InputWithoutAbortSignal<Input>[]): void {
        todo();
    }
}

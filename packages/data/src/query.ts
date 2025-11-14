import { TypedEventTarget } from "@loopui/interaction";
import { todo } from "./index.ts";
import type { InputWithoutAbortSignal, NormalizeInput } from "./types.ts";

export type Status = "idle" | "loading" | "success" | "error" | "stale";

export type QueryState<Value> =
    | { status: "idle"; value?: undefined; error?: undefined }
    | { status: "pending"; value?: Value; error?: undefined; promise: Promise<Value> }
    | { status: "success"; value: Value; error?: undefined }
    | { status: "error"; value?: Value; error: unknown };

export class QueryEvent<Input extends unknown[] | object, Value> extends Event {
    input: NormalizeInput<Input> = todo();
    state: QueryState<Value> = todo();

    constructor(name: Exclude<keyof QueryEventMap<Input, Value>, "statechange">) {
        super(name);
        todo();
    }
}

export class QueryStateChangeEvent<Input extends unknown[] | object, Value> extends Event {
    input: NormalizeInput<Input> = todo();
    current: QueryState<Value> = todo();
    previous: QueryState<Value> = todo();

    constructor(name: Extract<keyof QueryEventMap<Input, Value>, "statechange">) {
        super(name);
        todo();
    }
}

export interface QueryEventMap<Input extends unknown[] | object, Value> {
    statechange: QueryStateChangeEvent<Input, Value>;
    invalidate: QueryEvent<Input, Value>;
    refetch: QueryEvent<Input, Value>;
    fetch: QueryEvent<Input, Value>;
    evict: QueryEvent<Input, Value>;
}

export class Query<Input extends unknown[], Value> extends TypedEventTarget<
    QueryEventMap<Input, Value>
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
    peek(...input: InputWithoutAbortSignal<Input>): QueryState<Value> {
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

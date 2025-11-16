import type { ListenerFor } from "@loopui/interaction";
import { TypedEventTarget } from "@loopui/interaction";
import { todo } from "./index.ts";
import type {
    DataEventMap,
    DataState,
    InputWithoutAbortSignal,
    InputWithoutFormData,
    NormalizeInput,
} from "./types.ts";

export class ActionSubmitEvent<Input extends unknown[] | object> extends SubmitEvent {
    input: NormalizeInput<Input> = todo();
    formData: FormData = todo();
}

export class ActionSettledEvent<Input extends unknown[] | object> extends Event {
    input: NormalizeInput<Input> = todo();
}

export interface ActionEventMap<Input extends unknown[] | object, Value = void>
    extends DataEventMap<Input, Value> {
    submit: ActionSubmitEvent<Input>;
    settled: ActionSettledEvent<Input>;
}

export class FormAction {
    method = "POST";
    action: string = todo();
    on: { submit: ListenerFor<HTMLFormElement, "submit"> } = todo();
}

export class Action<Input extends unknown[], Value = void> extends TypedEventTarget<
    ActionEventMap<Input, Value>
> {
    constructor(mutation: (...input: Input) => Promise<Value>) {
        super();
        todo();
    }

    get(...input: InputWithoutAbortSignal<Input>): DataState<Value> {
        todo();
    }

    filter(
        predicate: (input: InputWithoutAbortSignal<Input>) => boolean,
    ): Omit<Action<[], Value>, "mutate" | "form" | "get"> & { get(): DataState<Value>[] } {
        todo();
    }

    mutate(...input: InputWithoutAbortSignal<Input>): Promise<Value> {
        todo();
    }

    form(...input: InputWithoutFormData<InputWithoutAbortSignal<Input>>): FormAction {
        todo();
    }
}

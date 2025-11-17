import type { ListenerFor } from "@loopui/events";
import { TypedEventTarget } from "@loopui/events";
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
    constructor(_mutation: (...input: Input) => Promise<Value>) {
        super();
        todo();
    }

    get(..._input: InputWithoutAbortSignal<Input>): DataState<Value> {
        todo();
    }

    filter(
        _predicate: (input: InputWithoutAbortSignal<Input>) => boolean,
    ): Omit<Action<[], Value>, "mutate" | "form" | "get"> & { get(): DataState<Value>[] } {
        todo();
    }

    mutate(..._input: InputWithoutAbortSignal<Input>): Promise<Value> {
        todo();
    }

    form(..._input: InputWithoutFormData<InputWithoutAbortSignal<Input>>): FormAction {
        todo();
    }
}

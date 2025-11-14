import type { ListenerFor } from "@loopui/interaction";
import { TypedEventTarget } from "@loopui/interaction";
import { todo } from "./index.ts";
import type { LoaderState } from "./loader.ts";
import type { InputWithoutAbortSignal, InputWithoutFormData, NormalizeInput } from "./types.ts";

export class FormActionEnhanceEvent<Input extends unknown[] | object> extends SubmitEvent {
    input: NormalizeInput<Input> = todo();
    formData: FormData | null = todo();
}

export interface ActionEventMap<Input extends unknown[] | object> {
    enhance: FormActionEnhanceEvent<Input>;
}

export class FormAction {
    method = "POST";
    action: string = todo();
    on: ListenerFor<HTMLFormElement, "submit"> = todo();
}

export class Action<Input extends unknown[], Value = void> extends TypedEventTarget<
    ActionEventMap<Input>
> {
    constructor(mutation: (...input: Input) => Promise<Value>) {
        super();
        todo();
    }

    mutate(...input: InputWithoutAbortSignal<Input>): Promise<Value> {
        todo();
    }

    peek(...input: InputWithoutAbortSignal<Input>): Value {
        todo();
    }

    get(...input: InputWithoutAbortSignal<Input>): LoaderState<Value> {
        todo();
    }

    form(...input: InputWithoutFormData<InputWithoutAbortSignal<Input>>): FormAction {
        todo();
    }
}

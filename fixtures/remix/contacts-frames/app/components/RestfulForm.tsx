import type { Remix } from "@remix-run/dom";
import { createEventType, dom } from "@remix-run/events";
import { Router } from "~/lib/Router.tsx";

const [enhance, createEnhance] = createEventType<FormData>("rmx:restful-form:enhance");
const [error, createError] = createEventType<unknown>("rmx:restful-form:error");
const [settled, createSettled] = createEventType("rmx:restful-form:settled");

export function RestfulForm(
    this: Remix.Handle,
    { action, method, children, on, ...props }: Remix.Props<"form">,
) {
    const router = this.context.get(Router);

    return () => {
        const effective = method !== "GET" ? "POST" : "GET";
        const needsHiddenInput = effective !== method;

        return (
            <form
                {...props}
                action={effective}
                method="POST"
                on={[
                    ...(on ? (Array.isArray(on) ? on : [on]) : []),
                    dom.submit(async event => {
                        const form = event.currentTarget;
                        const formData = new FormData(form);
                        form.dispatchEvent(createEnhance({ detail: formData }));

                        try {
                            await router.submit(form).finished;
                        } catch (error) {
                            form.dispatchEvent(createError({ detail: error }));
                        } finally {
                            form.dispatchEvent(createSettled());
                        }
                    }),
                ]}
            >
                {needsHiddenInput && <input name="_method" type="hidden" value={method} />}
                {children}
            </form>
        );
    };
}

RestfulForm.enhance = enhance;
RestfulForm.error = error;
RestfulForm.settled = settled;

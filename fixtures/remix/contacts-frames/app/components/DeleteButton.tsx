import { dom } from "@remix-run/events";
import { routes } from "~/routes.ts";
import { RestfulForm } from "./RestfulForm.tsx";

export function DeleteButton({ id }: { id: string }) {
    return (
        <RestfulForm
            action={routes.contacts.destroy.href({ contactId: id })}
            method={routes.contacts.destroy.method}
            on={dom.submit(event => {
                if (!confirm("Please confirm you want to delete this record.")) {
                    event.preventDefault();
                }
            })}
        >
            <button type="submit">Delete</button>
        </RestfulForm>
    );
}

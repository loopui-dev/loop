interface ErrorResponse {
    status: number;
    statusText: string;
}

declare function isRouteErrorResponse(error: unknown): error is ErrorResponse;

export function ErrorBoundary({ error }: { error: unknown }) {
    console.log(error);
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    // if (isRouteErrorResponse(error)) {
    //     message = error.status === 404 ? "404" : "Error";
    //     details =
    //         error.status === 404
    //             ? "The requested page could not be found."
    //             : error.statusText || details;
    // } else if (import.meta.env.DEV && error && error instanceof Error) {
    //     details = error.message;
    //     stack = error.stack;
    // }

    return (
        <main id="error-page">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre>
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}

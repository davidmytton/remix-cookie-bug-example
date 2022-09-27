import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getSession, commitSession } from "../sessions";
import { AuthenticityTokenInput } from "../csrf";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const message = session.get("globalMessage") || null;

  return json({ message });
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (request instanceof Request && request.bodyUsed) {
    throw new Error(
      "The body of the request was read before calling verifyAuthenticityToken. Ensure you clone it before reading it."
    );
  }
  // We clone the request to ensure we don't modify the original request.
  // This allow us to parse the body of the request and let the original request
  // still be used and parsed without errors.
  let formData =
    request instanceof FormData ? request : await request.clone().formData();

  // if the session doesn't have a csrf token, throw an error
  if (!session.has("csrf")) {
    throw new Error("CSRF token not found in session");
  }

  console.log("session.get(csrf)", session.get("csrf"));

  // if the body doesn't have a csrf token, throw an error
  if (!formData.get("csrf")) {
    throw new Error("Can't find CSRF token in body.");
  }

  console.log("formData.get(csrf)", formData.get("csrf"));

  // if the body csrf token doesn't match the session csrf token, throw an
  // error
  if (formData.get("csrf") !== session.get("csrf")) {
    throw new Error("Can't verify CSRF token authenticity.");
  }

  session.flash("globalMessage", "hello");

  return redirect("/nobug", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Index() {
  const { message } = useLoaderData();

  return (
    <>
      {message ? <strong>{message}</strong> : null}
      <Form method="post">
        <AuthenticityTokenInput />
        <button type="submit">Submit</button>
      </Form>
    </>
  );
}

import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { AuthenticityTokenProvider } from "./csrf";
import { json } from "@remix-run/node";
import * as crypto from "crypto";
import { getSession, commitSession } from "./sessions";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const token = crypto.randomBytes(16).toString("base64");
  session.set("csrf", token);

  return json(
    { csrf: token },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
};

export default function App() {
  const data = useLoaderData();

  return (
    <AuthenticityTokenProvider token={data.csrf}>
      <html lang="en">
        <head>
          <Meta />
          <Links />
        </head>
        <body>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </AuthenticityTokenProvider>
  );
}

import { createContext, ReactNode, useContext } from "react";

export interface AuthenticityTokenProviderProps {
  children: ReactNode;
  token: string;
}

export interface AuthenticityTokenInputProps {
  name?: string;
}

let context = createContext<string | null>(null);

/**
 * Save the Authenticity Token into context
 */
export function AuthenticityTokenProvider({
  children,
  token,
}: AuthenticityTokenProviderProps) {
  return <context.Provider value={token}>{children}</context.Provider>;
}

/**
 * Get the authenticity token, this should be used to send it in a submit.
 * @example
 * let token = useAuthenticityToken();
 * let submit = useSubmit();
 * function sendFormWithCode() {
 *   submit(
 *     { csrf: token, ...otherData },
 *     { action: "/action", method: "post" },
 *   );
 * }
 */
export function useAuthenticityToken() {
  let token = useContext(context);
  if (!token) throw new Error("Missing AuthenticityTokenProvider.");
  return token;
}

/**
 * Render a hidden input with the name csrf and the authenticity token as value.
 */
export function AuthenticityTokenInput({
  name = "csrf",
}: AuthenticityTokenInputProps) {
  let token = useAuthenticityToken();
  return <input type="hidden" value={token} name={name} />;
}

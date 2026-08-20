import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: Parameters<typeof intlMiddleware>[0]) {
  return intlMiddleware(request);
}

export const config = {
  // Skip API routes, Next internals and files with an extension (static assets).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

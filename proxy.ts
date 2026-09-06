import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

// Next.js 16 calls this file `proxy.ts` (formerly middleware.ts).
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, Vercel internals and any file with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};

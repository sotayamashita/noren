import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: "en",
  // "/" serves the default locale, "/ja" serves Japanese.
  localePrefix: "as-needed",
  locales: ["en", "ja"],
});

export type Locale = (typeof routing.locales)[number];

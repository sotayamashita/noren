import type { MetadataRoute } from "next";

import { site } from "@/content/site";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      `${site.url}${getPathname({ href: "/", locale })}`,
    ])
  );

  return routing.locales.map((locale) => ({
    alternates: { languages },
    changeFrequency: "weekly",
    lastModified,
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    url: `${site.url}${getPathname({ href: "/", locale })}`,
  }));
}

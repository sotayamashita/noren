import { useTranslations } from "next-intl";
import NextLink from "next/link";

import { Link } from "@/components/link";
import { site } from "@/content/site";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer>
      <nav
        aria-label={t("nav")}
        className="text-muted-foreground mx-auto flex w-full max-w-2xl gap-6 px-4 py-8 text-sm"
      >
        {site.repo ? (
          <Link
            className="hover:text-foreground [&>svg]:stroke-[1.5]"
            href={`https://github.com/${site.repo}`}
          >
            {t("links.github")}
          </Link>
        ) : null}
        {/* next/link on purpose: llms.txt is a route handler outside the locale tree. */}
        <NextLink className="hover:text-foreground" href="/llms.txt">
          {t("links.llms")}
        </NextLink>
      </nav>
    </footer>
  );
}

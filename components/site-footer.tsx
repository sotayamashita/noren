import { useTranslations } from "next-intl";
import Link from "next/link";

import { site } from "@/content/site";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer>
      <nav
        aria-label={t("nav")}
        className="text-muted-foreground mx-auto flex w-full max-w-2xl gap-4 px-4 py-8 text-sm"
      >
        {site.repo ? (
          <a
            className="hover:text-foreground"
            href={`https://github.com/${site.repo}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("links.github")}
          </a>
        ) : null}
        {/* next/link on purpose: llms.txt is a route handler outside the locale tree. */}
        <Link className="hover:text-foreground" href="/llms.txt">
          {t("links.llms")}
        </Link>
      </nav>
    </footer>
  );
}

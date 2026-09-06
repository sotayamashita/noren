import { useTranslations } from "next-intl";

import { GithubIcon } from "@/components/icons";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";

export function SiteHeader() {
  const t = useTranslations("header");

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-4">
        <Link className="font-semibold tracking-tight" href="/">
          {site.name}
        </Link>
        <nav aria-label={t("nav")} className="flex items-center gap-2">
          {site.repo ? (
            <a
              aria-label={t("github")}
              className={buttonVariants({ size: "icon", variant: "ghost" })}
              href={`https://github.com/${site.repo}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <GithubIcon />
            </a>
          ) : null}
          <LocaleSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

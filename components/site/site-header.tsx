import { useTranslations } from "next-intl";

import { GithubIcon } from "@/components/icons";
import { Link } from "@/components/link";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";

export function SiteHeader() {
  const t = useTranslations("header");

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-4">
        <Link className="font-semibold tracking-tight" href="/">
          {site.name}
        </Link>
        <nav aria-label={t("nav")} className="flex items-center gap-3">
          {site.repo ? (
            <Link
              aria-label={t("github")}
              className={buttonVariants({ size: "icon", variant: "ghost" })}
              href={`https://github.com/${site.repo}`}
              icon={false}
            >
              <GithubIcon />
            </Link>
          ) : null}
          <LocaleSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

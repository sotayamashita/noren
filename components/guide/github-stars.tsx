import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { GithubIcon } from "@/components/icons";
import { Link } from "@/components/link";
import { site } from "@/content/site";

/**
 * A pill linking to the repository. It shows no star count on purpose: a
 * small number reads as "nobody uses this" and costs more clicks than it
 * earns.
 */
export function GithubStars(): ReactNode {
  const t = useTranslations("stars");

  if (!site.repo) {
    return null;
  }

  return (
    <p>
      <Link
        className="bg-card hover:bg-accent inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm no-underline shadow-xs transition-colors"
        href={`https://github.com/${site.repo}`}
      >
        <GithubIcon className="size-4" />
        <span>{t("label")}</span>
      </Link>
    </p>
  );
}

import { getTranslations } from "next-intl/server";

import { GithubIcon } from "@/components/icons";
import { site } from "@/content/site";

const REVALIDATE_SECONDS = 3600;
const compactNumber = new Intl.NumberFormat("en", { notation: "compact" });

async function fetchStars(repo: string): Promise<number | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as { stargazers_count?: number };
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
}

export async function GithubStars() {
  if (!site.repo) {
    return null;
  }
  const [t, stars] = await Promise.all([
    getTranslations("stars"),
    fetchStars(site.repo),
  ]);
  const formatted = stars === null ? null : compactNumber.format(stars);

  return (
    <p>
      <a
        className="bg-card hover:bg-accent inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm no-underline shadow-xs transition-colors"
        href={`https://github.com/${site.repo}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <GithubIcon className="size-4" />
        <span>{t("label")}</span>
        {formatted && (
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 font-mono text-xs">
            ★ {formatted}
          </span>
        )}
      </a>
    </p>
  );
}

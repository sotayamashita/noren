import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Faq } from "@/components/sections/faq";
import { GithubStars } from "@/components/sections/github-stars";
import { Hero } from "@/components/sections/hero";
import { InstallCommand } from "@/components/sections/install-command";
import { Overview } from "@/components/sections/overview";
import { Steps } from "@/components/sections/steps";
import { routing } from "@/i18n/routing";

// Template import: Turbopack bundles every locale under content/*/overview.mdx.
const loadOverview = (locale: string) =>
  import(`@/content/${locale}/overview.mdx`);

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const { default: OverviewContent } = await loadOverview(locale);

  return (
    <div className="flex flex-col gap-16 pb-24">
      <Hero />
      <InstallCommand />
      <Steps />
      <GithubStars />
      <Overview>
        <OverviewContent />
      </Overview>
      <Faq />
    </div>
  );
}

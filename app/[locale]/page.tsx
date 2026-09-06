import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Guide } from "@/components/guide/guide";
import { Hero } from "@/components/site/hero";
import { routing } from "@/lib/i18n/routing";

// Keep dynamic import outside the component: React Compiler cannot lower it.
const loadGuide = (locale: string) => import(`@/content/${locale}/guide.mdx`);

const loadDemo = (locale: string) => import(`@/content/${locale}/demo`);

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const [{ demoScene }, { default: GuideContent }] = await Promise.all([
    loadDemo(locale),
    loadGuide(locale),
  ]);

  return (
    <div className="flex flex-col gap-16 pb-24">
      <Hero scene={demoScene} />
      <Guide>
        <GuideContent />
      </Guide>
    </div>
  );
}

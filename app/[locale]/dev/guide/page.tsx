import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { GuideGallery } from "@/gallery/guide/gallery";
import { routing } from "@/lib/i18n/routing";

const loadGuide = (locale: string) => import(`@/content/${locale}/guide.mdx`);

interface Props {
  params: Promise<{ locale: string }>;
}

/**
 * Dev-only gallery for every MDX element under Typeset and the published guide.
 */
export default async function DevGuidePage({
  params,
}: Props): Promise<ReactNode> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const { default: GuideContent } = await loadGuide(locale);

  return (
    <GuideGallery>
      <GuideContent />
    </GuideGallery>
  );
}

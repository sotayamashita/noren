import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Guide } from "@/components/guide/guide";
import GalleryContent from "@/gallery/guide/content.mdx";
import { routing } from "@/lib/i18n/routing";

import { Group, Tile } from "../tile";

const loadGuide = (locale: string) => import(`@/content/${locale}/guide.mdx`);

interface Props {
  params: Promise<{ locale: string }>;
}

/**
 * Dev-only gallery for every MDX element under Typeset and the published guide.
 */
export default async function DevUiPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const { default: GuideContent } = await loadGuide(locale);

  return (
    <div className="flex flex-col gap-12">
      <Group title="MDX under Typeset (gallery/guide/content.mdx)">
        <Tile name="guide / content">
          <Guide>
            <GalleryContent />
          </Guide>
        </Tile>
      </Group>
      <Group title="Published guide">
        <Tile name="guide / published content">
          <Guide>
            <GuideContent />
          </Guide>
        </Tile>
      </Group>
    </div>
  );
}

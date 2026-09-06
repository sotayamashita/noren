import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Faq } from "@/components/sections/faq";
import { GithubStars } from "@/components/sections/github-stars";
import { InstallCommand } from "@/components/sections/install-command";
import { Steps } from "@/components/sections/steps";
import KitchenSink from "@/content/dev/kitchen-sink.mdx";
import { routing } from "@/i18n/routing";

import { Group, Tile } from "../tile";

interface Props {
  params: Promise<{ locale: string }>;
}

/**
 * Dev-only gallery for the static parts of the page: every MDX element under
 * Typeset, and each landing section with its real copy.
 */
export default async function DevUiPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <div className="flex flex-col gap-12">
      <Group title="MDX under Typeset (content/dev/kitchen-sink.mdx)">
        <Tile name="mdx / kitchen sink">
          <div className="typeset typeset-docs">
            <KitchenSink />
          </div>
        </Tile>
      </Group>

      <Group title="Landing sections (real copy from messages/*.json)">
        <Tile name="section / install command">
          <InstallCommand />
        </Tile>
        <Tile name="section / steps">
          <Steps />
        </Tile>
        <Tile name="section / github stars">
          <GithubStars />
        </Tile>
        <Tile name="section / faq">
          <Faq />
        </Tile>
      </Group>
    </div>
  );
}

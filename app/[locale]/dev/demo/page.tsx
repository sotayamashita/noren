import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { skins } from "@/components/demo/agents/skins";
import type { AgentName } from "@/components/demo/agents/skins";
import { site } from "@/content/site";
import { DemoGallery } from "@/gallery/demo/gallery";
import { routing } from "@/lib/i18n/routing";

const loadDemo = (locale: string) => import(`@/content/${locale}/demo`);

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ agent?: string }>;
}

const isAgent = (value: string | undefined): value is AgentName =>
  value !== undefined && value in skins;

/**
 * Dev-only gallery: the live demo on top, every component state below.
 * `?agent=codex` switches the live demo's skin.
 */
export default async function DevDemoPage({
  params,
  searchParams,
}: Props): Promise<ReactNode> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const { demoScene } = await loadDemo(locale);
  const { agent } = await searchParams;
  const live = isAgent(agent) ? agent : site.demo.agent;

  return <DemoGallery agent={live} scene={demoScene} />;
}

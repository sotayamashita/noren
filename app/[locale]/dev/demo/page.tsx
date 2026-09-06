import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { skins } from "@/components/demo/agents/skins";
import type { AgentName } from "@/components/demo/agents/skins";
import { DevGallery } from "@/components/demo/dev-gallery";
import { DemoStage } from "@/components/demo/stage";
import { demoScene } from "@/content/demo/scene";
import { slackScene } from "@/content/demo/slack-scene";
import { site } from "@/content/site";
import { routing } from "@/i18n/routing";

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
export default async function DevDemoPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const { agent } = await searchParams;
  const live = isAgent(agent) ? agent : site.demo.agent;

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">
          Live demo{" "}
          <span className="text-muted-foreground font-mono text-sm">
            agent={live}
          </span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Switch with{" "}
          {(Object.keys(skins) as AgentName[]).map((name) => (
            <a className="me-3 underline" href={`?agent=${name}`} key={name}>
              ?agent={name}
            </a>
          ))}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["light", "dark"] as const).map((theme) => (
            <div
              className={`${theme} bg-background text-foreground flex justify-center rounded-xl border p-6`}
              data-theme={theme}
              key={theme}
            >
              <DemoStage agent={live} scene={demoScene} />
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">
          Live demo{" "}
          <span className="text-muted-foreground font-mono text-sm">
            layout=slack
          </span>
        </h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["light", "dark"] as const).map((theme) => (
            <div
              className={`${theme} bg-background text-foreground flex justify-center rounded-xl border p-6`}
              data-theme={theme}
              key={theme}
            >
              <DemoStage scene={slackScene} />
            </div>
          ))}
        </div>
      </section>
      <DevGallery />
    </div>
  );
}

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { DemoStage } from "@/components/demo/stage";
import type { Scene } from "@/lib/demo/scene";

/**
 * Hero: the looping demo followed by two lines of copy from `hero` in
 * `content/{locale}/site.json`. The header already shows the product name,
 * so neither line repeats it as a name.
 *
 * - `hero.headline` (h1): a tagline. Two short fragments, "what it does" then
 *   "who it is for" (Agentation: "Visual feedback. For agents."). No product
 *   name, no full sentence, no period-separated list of features.
 * - `hero.subheadline`: supporting copy. Two or three sentences: what the
 *   product is and does, how you use it, what you get back. The product name
 *   appears once, as the subject of the first sentence.
 *
 * The one-sentence form of the same claim lives in `meta.description`; the
 * guide starts at Install and does not restate any of this.
 */
export function Hero({ scene }: { scene: Scene }): ReactNode {
  const t = useTranslations("hero");

  return (
    <section className="flex flex-col gap-12">
      <div className="bg-muted dark:bg-background relative overflow-hidden px-4 pt-12 pb-12 sm:pt-16">
        <div className="mx-auto w-full max-w-3xl">
          <DemoStage scene={scene} />
        </div>
        <div
          aria-hidden
          className="to-background pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-b from-transparent"
        />
      </div>
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("headline")}
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg text-balance">
          {t("subheadline")}
        </p>
      </div>
    </section>
  );
}

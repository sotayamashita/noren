import { useTranslations } from "next-intl";

import { DemoStage } from "@/components/demo/stage";
import type { Scene } from "@/lib/demo/scene";

export function Hero({ scene }: { scene: Scene }) {
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
          {t("title")}
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg text-balance">
          {t("tagline")}
        </p>
      </div>
    </section>
  );
}

import { useTranslations } from "next-intl";

import { DemoStage } from "@/components/demo/stage";
import { demoScene } from "@/content/demo/scene";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="flex flex-col gap-12">
      <div className="bg-muted/30 relative overflow-hidden px-4 pt-12 pb-6 sm:pt-16">
        <div className="mx-auto w-full max-w-3xl">
          <DemoStage scene={demoScene} />
        </div>
        <div
          aria-hidden
          className="to-background pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent"
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

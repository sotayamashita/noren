import { useTranslations } from "next-intl";

import { Section } from "@/components/section";

interface Step {
  title: string;
  body: string;
}

export function Steps() {
  const t = useTranslations("steps");
  const items = t.raw("items") as Step[];

  return (
    <Section title={t("heading")}>
      <ol className="flex flex-col gap-5">
        {items.map((item, index) => (
          <li className="flex gap-4" key={item.title}>
            <span className="text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs">
              {index + 1}
            </span>
            <div className="flex flex-col gap-1">
              <p className="leading-6 font-medium">{item.title}</p>
              <p className="text-muted-foreground text-sm">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

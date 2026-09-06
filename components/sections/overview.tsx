import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Section } from "@/components/section";

/** Wraps MDX output in shadcn Typeset so headings, lists and code are styled. */
export function Overview({ children }: { children: ReactNode }) {
  const t = useTranslations("overview");

  return (
    <Section title={t("heading")}>
      <div className="typeset typeset-docs max-w-[35rem]">{children}</div>
    </Section>
  );
}

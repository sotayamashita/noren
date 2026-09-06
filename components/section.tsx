import type { ReactNode } from "react";

interface SectionProps {
  title?: string;
  children: ReactNode;
}

/** Narrow content column shared by every landing section. */
export function Section({ title, children }: SectionProps) {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4">
      {title && (
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      )}
      {children}
    </section>
  );
}

import type { ReactNode } from "react";

/** Shared Typeset boundary for the entire guide, including embedded controls. */
export function Guide({ children }: { children: ReactNode }): ReactNode {
  return (
    <article className="mx-auto w-full max-w-2xl px-4">
      <div className="typeset typeset-docs">{children}</div>
    </article>
  );
}

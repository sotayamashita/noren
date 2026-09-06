import type { ReactNode } from "react";

/** MDX supplies the steps; CSS counters keep numbering in document order. */
export function Steps({ children }: { children: ReactNode }): ReactNode {
  return (
    <figure>
      <ol className="not-typeset flex list-none flex-col gap-4 text-base leading-normal [counter-reset:step]">
        {children}
      </ol>
    </figure>
  );
}

export function Step({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): ReactNode {
  return (
    <li className="flex gap-4 [counter-increment:step]">
      <span
        aria-hidden
        className="text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs before:content-[counter(step)]"
      />
      <div className="flex min-w-0 flex-col gap-1">
        <div className="leading-6 font-medium text-balance">{title}</div>
        <div className="text-muted-foreground text-sm text-pretty">
          {children}
        </div>
      </div>
    </li>
  );
}

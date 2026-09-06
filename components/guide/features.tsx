import type { ReactNode } from "react";

import { Visual } from "@/components/guide/visuals";
import type { VisualName } from "@/components/guide/visuals";
import { cn } from "@/lib/utils";

/**
 * Feature cards in a small bento grid: two columns, three from `@lg`. MDX
 * supplies title and text; a card may pick a still-life visual by name and
 * span two columns with `wide` (`"lg"` spans only in the three-column grid,
 * which keeps the two-column grid free of holes).
 */
export function Features({ children }: { children: ReactNode }): ReactNode {
  return (
    <figure>
      <div className="not-typeset @container text-base leading-normal">
        <div className="grid grid-cols-2 gap-3 @lg:grid-cols-3">{children}</div>
      </div>
    </figure>
  );
}

export function Feature({
  title,
  visual,
  wide = false,
  children,
}: {
  title: string;
  visual?: VisualName;
  wide?: boolean | "lg";
  children: ReactNode;
}): ReactNode {
  return (
    <div
      className={cn(
        "bg-card flex flex-col overflow-hidden rounded-xl border shadow-xs",
        wide === true && "col-span-2",
        wide === "lg" && "@lg:col-span-2"
      )}
    >
      {visual ? (
        <div aria-hidden className="bg-muted/40 relative h-16 border-b">
          <Visual name={visual} />
        </div>
      ) : null}
      <div className="flex flex-col gap-1 p-4">
        <div className="text-sm leading-6 font-medium text-balance [word-break:auto-phrase]">
          {title}
        </div>
        <div className="text-muted-foreground text-sm text-pretty">
          {children}
        </div>
      </div>
    </div>
  );
}

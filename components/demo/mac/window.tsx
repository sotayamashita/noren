"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MacWindowProps {
  title: ReactNode;
  focused: boolean;
  style?: React.CSSProperties;
  children: ReactNode;
}

const FOCUS_SPRING = { damping: 26, stiffness: 260, type: "spring" } as const;

/** macOS style window chrome shared by the browser and terminal cards. */
export function MacWindow({ title, focused, style, children }: MacWindowProps) {
  return (
    <m.div
      animate={{ opacity: focused ? 1 : 0.92, scale: focused ? 1 : 0.98 }}
      className={cn(
        "bg-card text-card-foreground absolute flex flex-col overflow-hidden rounded-xl border shadow-sm",
        focused && "ring-foreground/5 shadow-xl ring-1"
      )}
      initial={false}
      style={{ ...style, zIndex: focused ? 2 : 1 }}
      transition={FOCUS_SPRING}
    >
      <div className="bg-muted/40 relative flex h-9 shrink-0 items-center border-b px-3">
        <span aria-hidden className="relative z-10 flex gap-1.5">
          <i className="bg-foreground/15 size-2.5 rounded-full" />
          <i className="bg-foreground/15 size-2.5 rounded-full" />
          <i className="bg-foreground/15 size-2.5 rounded-full" />
        </span>
        {/* Centred on the whole bar, not on the space left of the traffic lights. */}
        <div className="text-muted-foreground absolute inset-0 flex items-center justify-center px-14 text-xs">
          {title}
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
    </m.div>
  );
}

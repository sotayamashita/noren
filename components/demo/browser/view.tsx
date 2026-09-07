"use client";

import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";

import type { Block } from "@/lib/demo/scene";
import { cn } from "@/lib/utils";

interface BrowserViewProps {
  blocks: Block[];
  /** Block id scrolled to the top of the viewport; `null` is the top. */
  scroll: string | null;
  /** Dims the page while loading. */
  loading: boolean;
  /** Marks buttons as failed. */
  error: boolean;
}

/** Page padding in px; a scrolled-to block lands just below it. */
const PAGE_PADDING = 24;

/**
 * Draws the mocked page from `browser.view` blocks; each block is a cursor
 * anchor. `scroll` translates the page so the named block sits at the top,
 * with a transition unless the visitor prefers reduced motion.
 */
export function BrowserView({
  blocks,
  scroll,
  loading,
  error,
}: BrowserViewProps) {
  const page = useRef<HTMLDivElement>(null);

  // The offset depends on rendered block heights, so it is measured after
  // layout and written straight to the element rather than kept in state.
  useLayoutEffect(() => {
    const element = page.current;
    if (!element) {
      return;
    }
    const anchor =
      scroll && blocks.length > 0
        ? element.querySelector<HTMLElement>(`[data-anchor="${scroll}"]`)
        : null;
    const offset = anchor ? Math.max(0, anchor.offsetTop - PAGE_PADDING) : 0;
    element.style.transform = `translateY(${-offset}px)`;
  }, [scroll, blocks]);

  return (
    <div
      className={cn(
        "relative min-h-0 flex-1 overflow-hidden transition-opacity",
        loading && "opacity-50"
      )}
    >
      <div
        className="relative flex flex-col gap-3 p-6 transition-transform duration-700 ease-out motion-reduce:transition-none"
        ref={page}
      >
        {blocks.map((block) => (
          <BlockView block={block} error={error} key={block.id} />
        ))}
      </div>
    </div>
  );
}

function BlockView({ block, error }: { block: Block; error: boolean }) {
  const anchor = { "data-anchor": block.id };
  switch (block.kind) {
    case "demo": {
      return (
        <div
          className="bg-muted relative h-16 w-full overflow-hidden rounded-md border"
          {...anchor}
        >
          <div className="absolute inset-x-0 top-2 flex justify-center">
            <div className="relative w-40">
              <MiniWindow className="w-28">
                <MiniBar className="w-12" />
                <MiniBar className="w-20" />
                <div className="bg-primary h-2 w-8 rounded-sm" />
              </MiniWindow>
              <MiniWindow className="absolute top-3 left-16 w-20">
                <MiniBar className="bg-success/60 w-8 motion-safe:animate-pulse" />
                <MiniBar className="w-12" />
              </MiniWindow>
              <span className="bg-foreground ring-background absolute top-6 left-8 size-1.5 rounded-full ring-2 motion-safe:animate-pulse" />
            </div>
          </div>
        </div>
      );
    }
    case "media": {
      return (
        <div
          className="bg-muted flex h-16 w-full items-center justify-center rounded-md border"
          {...anchor}
        >
          <span className="bg-foreground/30 size-4 rounded-full" />
        </div>
      );
    }
    case "heading": {
      return block.label ? (
        <div className="text-demo leading-5 font-semibold" {...anchor}>
          {block.label}
        </div>
      ) : (
        <div className="bg-foreground/80 h-4 w-28 rounded" {...anchor} />
      );
    }
    case "text": {
      return (
        <div className="bg-foreground/15 h-2.5 w-44 rounded" {...anchor} />
      );
    }
    case "input": {
      return (
        <div className="bg-background h-8 rounded-md border" {...anchor} />
      );
    }
    case "button": {
      return (
        <div
          className={cn(
            "bg-primary text-primary-foreground mt-1 flex h-8 w-32 items-center justify-center rounded-md text-xs font-medium",
            error && "ring-destructive/60 ring-2"
          )}
          {...anchor}
        >
          {block.label}
        </div>
      );
    }
    case "code": {
      return (
        <div
          className="bg-muted flex h-10 w-full items-center gap-2 rounded-md border px-3"
          {...anchor}
        >
          <span className="text-muted-foreground font-mono text-xs">$</span>
          <MiniBar className="h-1.5 w-32" />
          <MiniBar className="h-1.5 w-8" />
          <span className="ms-auto flex size-4 items-center justify-center rounded-sm border">
            <span className="border-muted-foreground/60 size-2 rounded-sm border" />
          </span>
        </div>
      );
    }
    case "steps": {
      return (
        <ol className="flex w-full flex-col gap-2" {...anchor}>
          {["1", "2", "3"].map((step) => (
            <li className="flex items-center gap-2" key={step}>
              <span className="size-4 shrink-0 rounded-full border" />
              <MiniBar className={cn("h-2", step === "2" ? "w-40" : "w-28")} />
            </li>
          ))}
        </ol>
      );
    }
    case "cards": {
      // Bento: one wide card, then singles, like the guide's feature grid.
      return (
        <div className="grid w-full grid-cols-3 gap-2" {...anchor}>
          {["a", "b", "c", "d", "e"].map((card) => (
            <div
              className={cn(
                "bg-background flex flex-col gap-1 overflow-hidden rounded-md border",
                card === "a" && "col-span-2"
              )}
              key={card}
            >
              <div className="bg-muted h-4 w-full border-b" />
              <div className="flex flex-col gap-1 p-2">
                <MiniBar className="bg-foreground/60 h-1.5 w-8" />
                <MiniBar className="h-1 w-12" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    case "faq": {
      return (
        <div
          className="bg-background flex w-full flex-col divide-y rounded-md border"
          {...anchor}
        >
          {["a", "b", "c"].map((row) => (
            <div
              className="flex h-6 items-center justify-between px-2"
              key={row}
            >
              <MiniBar className="h-1.5 w-24" />
              <ChevronDownIcon className="text-muted-foreground size-3" />
            </div>
          ))}
        </div>
      );
    }
    default: {
      return null;
    }
  }
}

/** A window in the `demo` block: three dots and a body. */
function MiniWindow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <div
      className={cn(
        "bg-background overflow-hidden rounded-sm border shadow-xs",
        className
      )}
    >
      <div className="bg-muted/40 flex items-center gap-1 border-b px-1 py-1">
        <span className="bg-foreground/25 size-1 rounded-full" />
        <span className="bg-foreground/25 size-1 rounded-full" />
        <span className="bg-foreground/25 size-1 rounded-full" />
      </div>
      <div className="flex flex-col gap-1 p-1">{children}</div>
    </div>
  );
}

function MiniBar({ className }: { className?: string }): ReactNode {
  return <div className={cn("bg-foreground/15 h-1 rounded-sm", className)} />;
}

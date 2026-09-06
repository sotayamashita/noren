import { MonitorIcon, MoonIcon, StarIcon, SunIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Still-life visuals for feature cards: windows, bars and controls drawn with
 * tokens only, no words, so they need no translation and work in both themes.
 * Each fills the card's visual band; the band clips whatever runs past it.
 */

function Bar({ className }: { className?: string }): ReactNode {
  return (
    <div className={cn("bg-muted-foreground/25 h-1.5 rounded-sm", className)} />
  );
}

function Frame({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <div
      className={cn(
        "bg-background overflow-hidden rounded-md border shadow-xs",
        className
      )}
    >
      <div className="bg-muted/40 flex items-center gap-1 border-b px-2 py-1">
        <span className="bg-muted-foreground/30 size-1.5 rounded-full" />
        <span className="bg-muted-foreground/30 size-1.5 rounded-full" />
        <span className="bg-muted-foreground/30 size-1.5 rounded-full" />
      </div>
      {children}
    </div>
  );
}

function WindowVisual(): ReactNode {
  return (
    <div className="absolute inset-0 flex justify-center">
      <div className="relative mt-3 w-48">
        <Frame className="w-32">
          <div className="flex flex-col gap-2 p-2">
            <Bar className="w-16" />
            <Bar className="w-24" />
            <div className="bg-primary h-3 w-10 rounded-sm" />
          </div>
        </Frame>
        <Frame className="absolute top-4 left-24 w-24">
          <div className="flex flex-col gap-2 p-2 font-mono">
            <Bar className="bg-success/60 w-12" />
            <Bar className="w-16" />
          </div>
        </Frame>
        <span className="bg-foreground ring-background absolute top-8 left-12 size-2 rounded-full ring-2" />
      </div>
    </div>
  );
}

function TerminalVisual(): ReactNode {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-background flex w-40 items-center gap-2 rounded-md border px-3 py-2 shadow-xs">
        <span className="text-muted-foreground font-mono text-xs">$</span>
        <Bar className="w-16" />
        <Bar className="w-6" />
        <span className="ms-auto flex size-4 items-center justify-center rounded-sm border">
          <span className="border-muted-foreground/60 size-2 rounded-sm border" />
        </span>
      </div>
    </div>
  );
}

function ListVisual(): ReactNode {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ol className="flex w-32 flex-col gap-2">
        {["1", "2"].map((step) => (
          <li className="flex items-center gap-2" key={step}>
            <span className="text-muted-foreground flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-xs">
              {step}
            </span>
            <Bar className={step === "2" ? "w-20" : "w-14"} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function FeedbackVisual(): ReactNode {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-3">
      <span className="bg-background flex items-center gap-1 rounded-md border px-2 py-1 shadow-xs">
        <StarIcon className="size-3" strokeWidth={2} />
        <Bar className="w-6" />
      </span>
      <span className="bg-background flex flex-col gap-1 rounded-lg rounded-bl-sm border px-3 py-2 shadow-xs">
        <Bar className="w-16" />
        <Bar className="w-10" />
      </span>
    </div>
  );
}

function LanguagesVisual(): ReactNode {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-2">
      <span className="bg-background flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm font-medium shadow-xs">
        A
      </span>
      <span className="text-muted-foreground flex h-8 min-w-8 items-center justify-center rounded-md border border-dashed px-2 text-sm">
        あ
      </span>
    </div>
  );
}

function ThemeVisual(): ReactNode {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-muted flex gap-1 rounded-lg p-1">
        <span className="text-muted-foreground flex size-6 items-center justify-center rounded-md">
          <SunIcon className="size-3.5" strokeWidth={2} />
        </span>
        <span className="bg-background flex size-6 items-center justify-center rounded-md shadow-xs">
          <MoonIcon className="size-3.5" strokeWidth={2} />
        </span>
        <span className="text-muted-foreground flex size-6 items-center justify-center rounded-md">
          <MonitorIcon className="size-3.5" strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}

function FilesVisual(): ReactNode {
  return (
    <div className="absolute inset-0 flex items-end justify-center">
      <div className="relative h-12 w-40">
        {[0, 1, 2].map((index) => (
          <div
            className={cn(
              "bg-background absolute top-0 flex h-16 w-24 flex-col gap-2 rounded-md border p-3 shadow-xs",
              index === 0 && "left-0",
              index === 1 && "top-2 left-8",
              index === 2 && "top-4 left-16"
            )}
            key={index}
          >
            <Bar className="w-8" />
            <Bar className="w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

const visuals = {
  feedback: FeedbackVisual,
  files: FilesVisual,
  languages: LanguagesVisual,
  list: ListVisual,
  terminal: TerminalVisual,
  theme: ThemeVisual,
  window: WindowVisual,
} satisfies Record<string, ComponentType>;

export type VisualName = keyof typeof visuals;

/** Draws the still life registered under `name`. */
export function Visual({ name }: { name: VisualName }): ReactNode {
  const Component = visuals[name];
  return <Component />;
}

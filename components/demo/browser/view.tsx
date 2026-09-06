import type { Block } from "@/lib/demo/scene";
import { cn } from "@/lib/utils";

interface BrowserViewProps {
  blocks: Block[];
  /** Dims the page while loading. */
  loading: boolean;
  /** Marks buttons as failed. */
  error: boolean;
}

/** Draws the mocked page from `browser.view` blocks; each block is a cursor anchor. */
export function BrowserView({ blocks, loading, error }: BrowserViewProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-6 transition-opacity",
        loading && "opacity-50"
      )}
    >
      {blocks.map((block) => (
        <BlockView block={block} error={error} key={block.id} />
      ))}
    </div>
  );
}

function BlockView({ block, error }: { block: Block; error: boolean }) {
  const anchor = { "data-anchor": block.id };
  switch (block.kind) {
    case "heading": {
      return <div className="bg-foreground/80 h-4 w-28 rounded" {...anchor} />;
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
    default: {
      return null;
    }
  }
}

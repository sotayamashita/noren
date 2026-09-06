import type { ReactNode } from "react";

// Dev-only gallery helpers (used by /dev/demo and /dev/guide).

const THEMES = ["light", "dark"] as const;

/** A titled 2-column grid; tiles use subgrid so every light/dark cell shares one width. */
export function Group({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): ReactNode {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">{children}</div>
    </section>
  );
}

/**
 * Renders the same content twice: light tokens on the left, dark on the right.
 * `size` pins a fixed canvas (for absolutely positioned demo windows);
 * without it the content takes the cell's full width.
 */
export function Tile({
  name,
  size,
  children,
}: {
  name: string;
  size?: { width: number; height: number };
  children: ReactNode;
}): ReactNode {
  return (
    <figure
      className="col-span-2 m-0 grid grid-cols-subgrid gap-y-2"
      data-tile={name}
    >
      <figcaption className="text-muted-foreground col-span-2 font-mono text-xs">
        {name}
      </figcaption>
      {THEMES.map((theme) => (
        <div
          className={`${theme} bg-background text-foreground flex justify-center overflow-x-auto rounded-xl border p-4`}
          data-theme={theme}
          key={theme}
        >
          <div className={size ? "relative" : "w-full"} style={size}>
            {children}
          </div>
        </div>
      ))}
    </figure>
  );
}

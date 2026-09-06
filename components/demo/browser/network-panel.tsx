import type { NetworkEntry } from "@/lib/demo/scene";
import { cn } from "@/lib/utils";

export function NetworkPanel({ entries }: { entries: NetworkEntry[] }) {
  return (
    <>
      <div className="text-muted-foreground flex items-center justify-between px-3 py-1.5 text-xs tracking-wide uppercase">
        <span>Network</span>
        <span>{entries.length} requests</span>
      </div>
      <ul className="flex flex-col divide-y border-t font-mono text-xs">
        {entries.map((entry) => (
          <li
            className="flex items-center gap-2 px-3 py-1.5"
            key={`${entry.method}-${entry.path}`}
          >
            <span
              aria-hidden
              className={cn(
                "size-1.5 rounded-full",
                entry.status === "error" ? "bg-destructive" : "bg-success"
              )}
            />
            <span className="text-muted-foreground w-10">{entry.method}</span>
            <span className="flex-1 truncate">{entry.path}</span>
            <span
              className={
                entry.status === "error"
                  ? "text-destructive"
                  : "text-muted-foreground"
              }
            >
              {entry.status === "error" ? "500" : "200"}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

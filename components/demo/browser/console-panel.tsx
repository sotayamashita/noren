import type { ConsoleEntry } from "@/lib/demo/scene";

const levelClass: Record<ConsoleEntry["level"], string> = {
  error: "text-destructive",
  log: "text-muted-foreground",
  warn: "text-foreground",
};

export function ConsolePanel({ entries }: { entries: ConsoleEntry[] }) {
  return (
    <>
      <div className="text-muted-foreground flex items-center justify-between px-3 py-1.5 text-xs tracking-wide uppercase">
        <span>Console</span>
        <span className="tabular-nums">{entries.length} messages</span>
      </div>
      <ul className="flex flex-col divide-y border-t font-mono text-xs">
        {entries.map((entry) => (
          <li
            className={`flex gap-2 px-3 py-1.5 ${levelClass[entry.level]}`}
            key={entry.text}
          >
            <span className="w-10 shrink-0">[{entry.level}]</span>
            <span className="truncate">{entry.text}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

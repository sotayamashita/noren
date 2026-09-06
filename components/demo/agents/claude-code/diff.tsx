import { cn } from "@/lib/utils";

const DIFF_WIDTHS = [72, 48, 88, 60, 40];
const barWidth = (i: number) => DIFF_WIDTHS[i % DIFF_WIDTHS.length] ?? 60;

interface DiffProps {
  file: string;
  added: number;
  removed: number;
}

/** Claude Code's edit summary: `⏺ update (file)` plus green and red bars. */
export function ClaudeCodeDiff({ file, added, removed }: DiffProps) {
  const rows = [
    ...Array.from({ length: added }, (_, i) => ({
      id: `add-${i}`,
      tone: "success" as const,
      width: barWidth(i),
    })),
    ...Array.from({ length: removed }, (_, i) => ({
      id: `del-${i}`,
      tone: "error" as const,
      width: barWidth(i + 1),
    })),
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span aria-hidden className="text-primary">
          ⏺
        </span>
        <span>update</span>
        <span className="text-muted-foreground">({file})</span>
        <span className="text-success ms-auto">+{added}</span>
        <span className="text-destructive">−{removed}</span>
      </div>
      <div className="ms-5 flex flex-col gap-1">
        {rows.map((row) => (
          <div className="flex items-center gap-2" key={row.id}>
            <span
              className={cn(
                "w-2 text-xs",
                row.tone === "success" ? "text-success" : "text-destructive"
              )}
            >
              {row.tone === "success" ? "+" : "−"}
            </span>
            <span
              className={cn(
                "h-2 rounded-sm",
                row.tone === "success" ? "bg-success/25" : "bg-destructive/25"
              )}
              style={{ width: `${row.width}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

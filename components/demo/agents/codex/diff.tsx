interface DiffProps {
  file: string;
  added: number;
  removed: number;
}

/** Codex's one-line edit summary. */
export function CodexDiff({ file, added, removed }: DiffProps) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground">•</span>
      <span>
        Edited <span className="font-semibold">{file}</span>{" "}
        <span className="text-success">+{added}</span>{" "}
        <span className="text-destructive">−{removed}</span>
      </span>
    </div>
  );
}

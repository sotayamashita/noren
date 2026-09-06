const MODEL = "gpt-6-astra max fast";

/** Codex always shows its input box and a status line under the transcript. */
export function CodexFooter({ directory }: { directory: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="bg-muted/60 flex gap-2 rounded-md px-3 py-2">
        <span>›</span>
        <span className="text-muted-foreground">Ask Codex to do anything</span>
      </div>
      <div className="text-muted-foreground px-3 text-xs">
        {MODEL} · {directory}
      </div>
    </div>
  );
}

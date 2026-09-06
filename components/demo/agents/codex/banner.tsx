const MODEL = "gpt-6-astra max fast";

/** Codex start-up box: name, model, directory, permissions. */
export function CodexBanner({ directory }: { directory: string }) {
  return (
    <div className="border-foreground/30 flex flex-col gap-1 rounded-md border px-3 py-2">
      <div className="font-semibold">
        <span className="text-muted-foreground">&gt;_ </span>OpenAI Codex
      </div>
      <dl className="text-muted-foreground grid grid-cols-[auto_1fr] gap-x-3">
        <dt>model:</dt>
        <dd className="text-foreground">{MODEL}</dd>
        <dt>directory:</dt>
        <dd className="text-foreground">{directory}</dd>
        <dt>permissions:</dt>
        <dd className="text-foreground">default</dd>
      </dl>
    </div>
  );
}

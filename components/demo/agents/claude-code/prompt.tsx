export function ClaudeCodePrompt({ text }: { text: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground">›</span>
      <span className="bg-muted text-foreground rounded px-1.5">{text}</span>
    </div>
  );
}

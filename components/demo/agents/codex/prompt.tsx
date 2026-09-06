export function CodexPrompt({ text }: { text: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground">›</span>
      <span>{text}</span>
    </div>
  );
}

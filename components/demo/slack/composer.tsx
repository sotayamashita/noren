import { Mention } from "./message";

/** Slack's message box: `+`, the draft text, and the send control. */
export function Composer({ draft }: { draft: string }) {
  const mention = draft.startsWith("@") ? draft.split(/\s(?=[a-z])/u)[0] : "";
  return (
    <div className="shrink-0 px-4 pb-3">
      <div className="flex h-10 items-center gap-2 rounded-lg border px-3">
        <span aria-hidden className="text-muted-foreground text-base">
          +
        </span>
        <span className="min-w-0 flex-1 truncate">
          {draft ? <Mention mention={mention} text={draft} /> : null}
        </span>
        <span aria-hidden className="text-muted-foreground text-xs">
          ➤ ⌄
        </span>
      </div>
    </div>
  );
}

/** Claude Code start-up box: mascot, greeting, model and directory. */
export function ClaudeCodeBanner({ directory }: { directory: string }) {
  return (
    <fieldset className="border-foreground/30 flex flex-col items-center gap-1 rounded-md border px-3 pt-1 pb-2 text-center">
      <legend className="text-primary px-1 font-semibold">Claude Code</legend>
      <div className="font-semibold">Welcome back!</div>
      <Mascot />
      <div className="text-muted-foreground">
        Opus 5 (1M context) · Claude Max
      </div>
      <div className="text-muted-foreground">{directory}</div>
    </fieldset>
  );
}

/** Claude Code's pixel mascot. Brand orange on purpose; eyes take the card colour. */
function Mascot() {
  return (
    <svg aria-hidden className="h-auto w-9" fill="none" viewBox="0 0 217 144">
      <path
        d="M216.06 57.69H188.18V0H27.88V57.69H0V86.85H27.44V114.73H41.28V143.89H55.57V114.73H68.52V143.45H82.36V115.17H133.42V143.89H147.71V115.17H160.66V143.45H174.06V115.17H187.91V86.85H216.02V57.69H216.06Z"
        fill="#F76038"
      />
      <path d="M55.63 29.61H68.58V57.69H55.63V29.61Z" fill="var(--card)" />
      <path d="M147.76 29.83H160.71V57.69H147.76V29.83Z" fill="var(--card)" />
    </svg>
  );
}

"use client";

import { useEffect, useState } from "react";

const TICK_MS = 1000;

/** Codex has no glyph spinner: just `Working (3s • esc to interrupt)` counting up. */
export function CodexSpinner(_props: { message: string }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeconds((current) => current + 1);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div>
      <span className="font-semibold">Working</span>
      <span className="text-muted-foreground">
        {" "}
        ({seconds}s • esc to interrupt)
      </span>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

const GLYPHS = ["·", "✢", "✳", "✶", "✻", "✽"];
const GLYPH_INTERVAL_MS = 120;

/** Claude Code's glyph spinner with a shimmering message. */
export function ClaudeCodeSpinner({ message }: { message: string }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setFrame((current) => (current + 1) % GLYPHS.length);
    }, GLYPH_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className="text-primary w-3 text-center">
        {GLYPHS[frame]}
      </span>
      <span
        className="[animation:demo-shimmer_1.6s_linear_infinite] bg-[length:200%_100%] bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--muted-foreground) 0%, var(--foreground) 50%, var(--muted-foreground) 100%)",
        }}
      >
        {message}
      </span>
    </span>
  );
}

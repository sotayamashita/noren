"use client";

import { AnimatePresence, m } from "motion/react";

import type { TerminalEntry, Tone } from "@/lib/demo/scene";

import type { AgentSkin } from "./agents/types";
import { MacWindow } from "./mac/window";

interface TerminalProps {
  entries: TerminalEntry[];
  directory: string | null;
  skin: AgentSkin;
  focused: boolean;
  style?: React.CSSProperties;
}

const toneClass: Record<Tone, string> = {
  default: "text-foreground",
  error: "text-destructive",
  muted: "text-muted-foreground",
  success: "text-success",
};

const ENTER = { opacity: 0, y: 6 };
const VISIBLE = { opacity: 1, y: 0 };

/** Terminal window: keeps the transcript, delegates every line to the skin. */
export function Terminal({
  entries,
  directory,
  skin,
  focused,
  style,
}: TerminalProps) {
  return (
    <MacWindow
      focused={focused}
      style={style}
      title={<span className="font-mono">{skin.title}</span>}
    >
      <div className="flex flex-1 flex-col justify-end gap-2 overflow-hidden p-4 font-mono text-[13px] leading-5">
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <m.div
              animate={VISIBLE}
              exit={{ opacity: 0 }}
              initial={ENTER}
              key={entry.id}
              layout
            >
              <Line entry={entry} skin={skin} />
            </m.div>
          ))}
        </AnimatePresence>
      </div>
      {skin.Footer && directory ? (
        <div className="p-4 pt-0 font-mono text-[13px] leading-5">
          <skin.Footer directory={directory} />
        </div>
      ) : null}
    </MacWindow>
  );
}

function Line({ entry, skin }: { entry: TerminalEntry; skin: AgentSkin }) {
  switch (entry.kind) {
    case "boot": {
      return <skin.Banner directory={entry.directory} />;
    }
    case "prompt": {
      return <skin.Prompt text={entry.text} />;
    }
    case "spinner": {
      return <skin.Spinner message={entry.message} />;
    }
    case "line": {
      return <div className={toneClass[entry.tone]}>{entry.text}</div>;
    }
    case "diff": {
      return (
        <skin.Diff
          added={entry.added}
          file={entry.file}
          removed={entry.removed}
        />
      );
    }
    default: {
      return null;
    }
  }
}

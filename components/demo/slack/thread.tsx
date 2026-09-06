"use client";

import { AnimatePresence, m } from "motion/react";

import type { SlackAttachment, SlackReply } from "@/lib/demo/scene";
import { cn } from "@/lib/utils";

import { Composer } from "./composer";
import { Avatar } from "./message";

/** Slack's green primary button. */
const PRIMARY = "#007A5A";

const kindLabel: Record<SlackAttachment["kind"], string> = {
  canvas: "canvas",
  file: "file",
  sheet: "Google Sheets",
  slides: "Google Slides",
};

const kindGlyph: Record<SlackAttachment["kind"], string> = {
  canvas: "▤",
  file: "▣",
  sheet: "▦",
  slides: "▭",
};

interface ThreadProps {
  agent: string;
  replies: SlackReply[];
}

export function Thread({ agent, replies }: ThreadProps) {
  return (
    <>
      <header className="flex h-10 shrink-0 items-center justify-between border-b px-4 font-semibold">
        Thread
        <span aria-hidden className="text-muted-foreground text-xs">
          ⧉ ✕
        </span>
      </header>
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-4 overflow-hidden px-4 py-3">
        <AnimatePresence initial={false}>
          {replies.map((reply) => (
            <m.div
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
              initial={{ opacity: 0, y: 8 }}
              key={reply.id}
              layout
            >
              <Avatar kind="agent" name={agent} />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="leading-normal text-pretty">
                  <span className="font-bold">{agent}</span>
                  <br />
                  {reply.text}
                </div>
                {reply.attachments?.map((item) => (
                  <div
                    className="flex items-center gap-2.5 rounded-lg border px-3 py-2"
                    data-anchor={item.id}
                    key={item.id}
                  >
                    <span
                      aria-hidden
                      className="flex size-7 items-center justify-center rounded-md bg-sky-500 text-white"
                    >
                      {kindGlyph[item.kind]}
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-xs font-semibold">
                        {item.title}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {kindLabel[item.kind]}
                      </span>
                    </span>
                  </div>
                ))}
                {reply.actions?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {reply.actions.map((action) => (
                      <span
                        className={cn(
                          "rounded-md border px-3 py-1.5 text-xs font-semibold",
                          action.primary && "border-transparent text-white"
                        )}
                        data-anchor={action.id}
                        key={action.id}
                        style={
                          action.primary ? { background: PRIMARY } : undefined
                        }
                      >
                        {action.label}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
      <Composer draft="" />
    </>
  );
}

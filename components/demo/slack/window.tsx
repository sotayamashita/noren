"use client";

import { AnimatePresence, m } from "motion/react";
import type { ReactNode } from "react";

import type { SlackState } from "@/lib/demo/scene";
import { cn } from "@/lib/utils";

import { Composer } from "./composer";
import { Message, SkeletonMessage } from "./message";
import { Thread } from "./thread";

interface SlackWindowProps {
  slack: SlackState;
  style?: React.CSSProperties;
}

/** Slack's aubergine frame; brand colour on purpose, same in both themes. */
const FRAME = "#4A154B";

const skeletonKeys = (count: number) =>
  Array.from({ length: count }, (_, i) => `history-${i}`);

const THREAD_SPRING = { damping: 30, stiffness: 320, type: "spring" } as const;

/**
 * Slack desktop window: rail, channel pane and (when open) the thread pane.
 * The look follows the Agentforce demo videos: blurred history above the
 * real conversation, agent replies in a thread with cards and buttons.
 */
export function SlackWindow({ slack, style }: SlackWindowProps) {
  const post = slack.posts.at(-1);
  const replyCount = slack.replies.length;

  return (
    <div
      className="absolute flex flex-col overflow-hidden rounded-xl text-sm shadow-xl"
      style={{ ...style, background: FRAME }}
    >
      <div aria-hidden className="flex h-8 shrink-0 items-center gap-1.5 px-3">
        <i className="size-2.5 rounded-full bg-[#FF5F57]" />
        <i className="size-2.5 rounded-full bg-[#FEBC2E]" />
        <i className="size-2.5 rounded-full bg-[#28C840]" />
      </div>
      <div className="flex min-h-0 flex-1">
        <Rail agent={slack.agent} />
        <div className="bg-card text-card-foreground me-2 mb-2 flex min-w-0 flex-1 overflow-hidden rounded-lg">
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-10 shrink-0 items-center gap-1 border-b px-4 font-semibold">
              <span className="text-muted-foreground">#</span>
              {slack.channel}
              <span className="text-muted-foreground">⌄</span>
            </header>
            <div className="flex min-h-0 flex-1 flex-col justify-end gap-4 overflow-hidden px-4 py-3">
              {skeletonKeys(slack.history).map((key) => (
                <SkeletonMessage key={key} />
              ))}
              <AnimatePresence initial={false}>
                {slack.posts.map((item) => (
                  <m.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 8 }}
                    key={item.id}
                    layout
                  >
                    <Message
                      agent={slack.agent}
                      post={item}
                      replies={item.id === post?.id ? replyCount : 0}
                    />
                  </m.div>
                ))}
              </AnimatePresence>
            </div>
            <Composer draft={slack.draft} />
          </div>
          <AnimatePresence>
            {slack.threadOpen ? (
              <m.aside
                animate={{ opacity: 1, x: 0 }}
                className="flex w-[46%] shrink-0 flex-col border-s"
                exit={{ opacity: 0, x: 24 }}
                initial={{ opacity: 0, x: 24 }}
                transition={THREAD_SPRING}
              >
                <Thread agent={slack.agent} replies={slack.replies} />
              </m.aside>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Rail({ agent }: { agent: string }) {
  return (
    <nav
      aria-hidden
      className="text-demo-label flex w-16 shrink-0 flex-col items-center gap-3 px-1 pb-3 text-white/80"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-white font-bold text-[#4A154B]">
        a
      </span>
      <RailItem active label="Home">
        ⌂
      </RailItem>
      <RailItem label="DMs">◠</RailItem>
      <RailItem label={agent.split(" ")[0] ?? "Agent"}>☺</RailItem>
      <span className="mt-auto flex size-7 items-center justify-center rounded-full bg-white/10 text-base">
        +
      </span>
      <span className="relative size-7 rounded-md bg-white/30">
        <i className="absolute -end-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-[#4A154B] bg-[#2BAC76]" />
      </span>
    </nav>
  );
}

function RailItem({
  label,
  active,
  children,
}: {
  label: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <span className="flex flex-col items-center gap-0.5">
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-lg text-base",
          active && "bg-white/20"
        )}
      >
        {children}
      </span>
      <span className="max-w-14 truncate">{label}</span>
    </span>
  );
}

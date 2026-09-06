"use client";

import { AnimatePresence, m } from "motion/react";

import type { SceneState } from "@/lib/demo/scene";
import { cn } from "@/lib/utils";

import { MacWindow } from "../mac/window";
import { ConsolePanel } from "./console-panel";
import { NetworkPanel } from "./network-panel";
import { BrowserView } from "./view";

interface BrowserWindowProps {
  browser: SceneState["browser"];
  focused: boolean;
  style?: React.CSSProperties;
}

const stateDot: Record<SceneState["browser"]["state"], string> = {
  error: "bg-destructive",
  idle: "bg-foreground/20",
  loading: "bg-foreground/40 animate-pulse",
  ok: "bg-success",
};

const PANEL_SPRING = { damping: 30, stiffness: 300, type: "spring" } as const;

export function BrowserWindow({ browser, focused, style }: BrowserWindowProps) {
  return (
    <MacWindow
      focused={focused}
      style={style}
      title={
        <span className="bg-background flex h-6 w-full max-w-64 items-center justify-center gap-2 rounded-md border px-2.5 text-xs">
          <span
            aria-hidden
            className={cn("size-1.5 rounded-full", stateDot[browser.state])}
          />
          <span className="truncate">{browser.url}</span>
        </span>
      }
    >
      {browser.state === "loading" ? (
        <span
          aria-hidden
          className="bg-foreground/60 absolute inset-x-0 top-0 h-0.5 origin-left [animation:demo-progress_0.7s_ease-out_forwards]"
        />
      ) : null}

      <BrowserView
        blocks={browser.blocks}
        error={browser.state === "error"}
        loading={browser.state === "loading"}
      />

      {/* One drawer, keyed by panel kind, so console → network slides out and in. */}
      <AnimatePresence>
        {browser.panel ? (
          <m.div
            animate={{ y: 0 }}
            className="bg-background/95 absolute inset-x-0 bottom-0 border-t backdrop-blur-sm"
            exit={{ y: "100%" }}
            initial={{ y: "100%" }}
            key={browser.panel}
            transition={PANEL_SPRING}
          >
            {browser.panel === "network" ? (
              <NetworkPanel entries={browser.network} />
            ) : (
              <ConsolePanel entries={browser.console} />
            )}
          </m.div>
        ) : null}
      </AnimatePresence>
    </MacWindow>
  );
}

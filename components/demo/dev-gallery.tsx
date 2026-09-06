"use client";

import { domAnimation, LazyMotion } from "motion/react";
import { useState } from "react";

import { Group, Tile } from "@/components/dev-tile";
import type {
  CursorTone,
  SceneState,
  SlackState,
  TerminalEntry,
} from "@/lib/demo/scene";

import { skins } from "./agents/skins";
import type { AgentName } from "./agents/skins";
import { BrowserWindow } from "./browser/window";
import { MacCursor } from "./mac/cursor";
import { SlackWindow } from "./slack/window";
import { Terminal } from "./terminal";

// Dev-only page: copy is intentionally hardcoded (not in messages/*.json).

const ENTRIES: TerminalEntry[] = [
  { directory: "~/projects/acme", id: "boot", kind: "boot" },
  { id: "prompt", kind: "prompt", text: "/showcase test the signup flow" },
  { id: "muted", kind: "line", text: "2 files changed", tone: "muted" },
  {
    id: "error",
    kind: "line",
    text: "✗ POST /api/signup → 500",
    tone: "error",
  },
  { added: 4, file: "api/signup.ts", id: "diff", kind: "diff", removed: 1 },
  {
    id: "success",
    kind: "line",
    text: "✓ signup flow passes",
    tone: "success",
  },
  { id: "spinner", kind: "spinner", message: "fixing…" },
];

const PAGE: SceneState["browser"]["blocks"] = [
  { id: "title", kind: "heading" },
  { id: "intro", kind: "text" },
  { id: "email", kind: "input" },
  { id: "signup", kind: "button", label: "Sign up" },
];

const BROWSERS: { name: string; browser: SceneState["browser"] }[] = [
  {
    browser: base({ blocks: [] }),
    name: "idle, empty page",
  },
  {
    browser: base({ state: "loading" }),
    name: "loading",
  },
  {
    browser: base({
      network: [
        { method: "GET", path: "/signup", status: "ok" },
        { method: "POST", path: "/api/signup", status: "ok" },
      ],
      panel: "network",
      state: "ok",
    }),
    name: "ok + network panel",
  },
  {
    browser: base({
      console: [
        { level: "log", text: "submit signup" },
        { level: "warn", text: "slow request: 1.2s" },
        { level: "error", text: "POST /api/signup 500" },
      ],
      panel: "console",
      state: "error",
    }),
    name: "error + console panel",
  },
];

function base(
  overrides: Partial<SceneState["browser"]>
): SceneState["browser"] {
  return {
    blocks: PAGE,
    console: [],
    network: [],
    panel: null,
    state: "ok",
    url: "localhost:3000/signup",
    ...overrides,
  };
}

const SLACK_POST: SlackState["posts"][number] = {
  author: "Emily Nishino",
  id: "ask",
  mention: "@Deal support agent",
  reactions: ["👀"],
  role: "user",
  text: "@Deal support agent ACME wants a 12-month term instead of 24. What should we do?",
};

const SLACK_REPLIES: SlackState["replies"] = [
  {
    actions: [
      { id: "yes", label: "Yes", primary: true },
      { id: "no", label: "No" },
    ],
    attachments: [
      { id: "legal", kind: "canvas", title: "Legal request draft" },
    ],
    id: "draft",
    text: "Hi! I drafted a legal request for ACME's 12-month terms. Want me to send it?",
  },
  {
    attachments: [
      { id: "deck", kind: "slides", title: "Aqua Inc. (competitor) — latest" },
      { id: "price", kind: "sheet", title: "Price list: ACME" },
    ],
    id: "sent",
    text: "Sent to legal. I also attached the latest competitor deck for the call.",
  },
];

const SLACKS: { name: string; slack: SlackState }[] = [
  {
    name: "channel, composing an @mention",
    slack: slackBase({ draft: "@Deal support agent ACME wants a 12-month" }),
  },
  {
    name: "channel, message with reactions and a reply link",
    slack: slackBase({
      posts: [SLACK_POST],
      replies: SLACK_REPLIES.slice(0, 1),
    }),
  },
  {
    name: "thread open: cards and action buttons",
    slack: slackBase({
      posts: [SLACK_POST],
      replies: SLACK_REPLIES,
      threadOpen: true,
    }),
  },
];

function slackBase(overrides: Partial<SlackState>): SlackState {
  return {
    agent: "Deal support agent",
    channel: "deals-acme",
    draft: "",
    history: 2,
    posts: [],
    replies: [],
    threadOpen: false,
    ...overrides,
  };
}

const SLACK_SIZE = { height: 400, width: 560 };
const TERMINAL_SIZE = { height: 600, width: 400 };
const BROWSER_SIZE = { height: 320, width: 460 };

export function DevGallery() {
  return (
    <LazyMotion features={domAnimation} strict>
      <div className="flex flex-col gap-10">
        <Group title="Terminal skins (every entry kind)">
          {(Object.keys(skins) as AgentName[]).map((name) => (
            <Tile key={name} name={`${name} / terminal`} size={TERMINAL_SIZE}>
              <Terminal
                directory="~/projects/acme"
                entries={ENTRIES}
                focused
                skin={skins[name]}
                style={{ inset: 0 }}
              />
            </Tile>
          ))}
        </Group>

        <Group title="Browser states">
          {BROWSERS.map((item) => (
            <Tile
              key={item.name}
              name={`browser / ${item.name}`}
              size={BROWSER_SIZE}
            >
              <BrowserWindow
                browser={item.browser}
                focused
                style={{ inset: 0 }}
              />
            </Tile>
          ))}
        </Group>

        <Group title="Slack">
          {SLACKS.map((item) => (
            <Tile
              key={item.name}
              name={`slack / ${item.name}`}
              size={SLACK_SIZE}
            >
              <SlackWindow slack={item.slack} style={{ inset: 0 }} />
            </Tile>
          ))}
        </Group>

        <Group title="Cursor (error shakes once on mount)">
          {(["default", "error", "success"] as const).map((tone) => (
            <CursorTile key={tone} tone={tone} />
          ))}
        </Group>
      </div>
    </LazyMotion>
  );
}

function CursorTile({ tone }: { tone: CursorTone }) {
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  return (
    <Tile name={`cursor / ${tone}`} size={BROWSER_SIZE}>
      <div className="absolute inset-0" ref={setStage}>
        <BrowserWindow
          browser={base({ state: tone === "error" ? "error" : "ok" })}
          focused
          style={{ inset: 0 }}
        />
        <MacCursor
          clicking={false}
          label="Sign up"
          stage={stage}
          target="signup"
          tone={tone}
        />
      </div>
    </Tile>
  );
}

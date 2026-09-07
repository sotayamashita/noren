/**
 * Scene DSL for the motion demo.
 *
 * A scene is a list of timestamped steps that mutate a small state machine
 * (terminal transcript, browser window, Slack window, cursor, focus). The
 * player replays the steps on a timer and loops. The look of the terminal
 * (Claude Code, Codex…) is chosen by `site.demo.agent`, not by the scene.
 */

export type Tone = "default" | "muted" | "success" | "error";

export type BrowserState = "idle" | "loading" | "ok" | "error";

export interface NetworkEntry {
  method: string;
  path: string;
  status: "ok" | "error";
}

export interface ConsoleEntry {
  level: "log" | "warn" | "error";
  text: string;
}

/**
 * A block in the mocked browser page. `id` is what the cursor targets and
 * what `browser.scroll` scrolls to.
 * - `media` is a framed area standing in for an image or video.
 * - `demo` is a miniature of this stage, a browser and a terminal with a
 *   moving cursor, for pages that embed a looping demo of their own.
 * - `code`, `steps`, `cards` and `faq` stand in for the sections of a guide:
 *   an install command, numbered steps, a card grid and an accordion.
 */
export interface Block {
  id: string;
  kind:
    | "heading"
    | "text"
    | "input"
    | "button"
    | "media"
    | "demo"
    | "code"
    | "steps"
    | "cards"
    | "faq";
  label?: string;
}

export type Panel = "network" | "console" | null;

export type CursorTone = "default" | "error" | "success";

/** A message in the Slack channel. Its reply link is anchored as `${id}-replies`. */
export interface SlackPost {
  id: string;
  author: string;
  role: "user" | "agent";
  text: string;
  /** Substring of `text` rendered as an @mention. */
  mention?: string;
  reactions?: string[];
}

export interface SlackAttachment {
  id: string;
  title: string;
  kind: "canvas" | "slides" | "sheet" | "file";
}

/** A button under an agent reply. `id` is what the cursor targets. */
export interface SlackAction {
  id: string;
  label: string;
  primary?: boolean;
}

export interface SlackReply {
  id: string;
  text: string;
  attachments?: SlackAttachment[];
  actions?: SlackAction[];
}

export type SceneStep =
  | { at: number; type: "terminal.boot"; directory: string }
  | { at: number; type: "terminal.prompt"; text: string }
  | { at: number; type: "terminal.spinner"; message: string }
  | { at: number; type: "terminal.line"; text: string; tone?: Tone }
  | {
      at: number;
      type: "terminal.diff";
      file: string;
      added: number;
      removed: number;
    }
  | { at: number; type: "browser.url"; url: string }
  | { at: number; type: "browser.state"; state: BrowserState }
  | { at: number; type: "browser.view"; blocks: Block[] }
  /** Scrolls the page so the block sits at the top; `null` returns to the top. */
  | { at: number; type: "browser.scroll"; target: string | null }
  /** A stage-only badge over the page: a green check and `text`; `null` hides it. */
  | { at: number; type: "browser.overlay"; text: string | null }
  | {
      at: number;
      type: "browser.panel";
      panel: Panel;
      network?: NetworkEntry[];
      console?: ConsoleEntry[];
    }
  | {
      at: number;
      type: "slack.channel";
      name: string;
      /** Display name of the agent that answers in threads. */
      agent: string;
      /** Number of blurred older messages above the real ones. */
      history?: number;
    }
  | { at: number; type: "slack.compose"; text: string }
  | ({ at: number; type: "slack.post" } & SlackPost)
  | ({ at: number; type: "slack.reply" } & SlackReply)
  | { at: number; type: "slack.thread"; open: boolean }
  | {
      at: number;
      type: "cursor";
      /** Block id to point at; `null` hides the cursor. */
      target: string | null;
      label?: string;
      click?: boolean;
      /** `error` turns the cursor red and shakes it; `success` shows a check. */
      tone?: CursorTone;
    }
  | { at: number; type: "focus"; target: "terminal" | "browser" };

export interface Scene {
  /** Total length in ms. The player resets and loops when reached. */
  duration: number;
  /** Which windows the stage draws. Defaults to the browser + terminal pair. */
  layout?: "agent-browser" | "slack";
  steps: SceneStep[];
}

export type TerminalEntry =
  | { id: string; kind: "boot"; directory: string }
  | { id: string; kind: "prompt"; text: string }
  | { id: string; kind: "spinner"; message: string }
  | { id: string; kind: "line"; text: string; tone: Tone }
  | {
      id: string;
      kind: "diff";
      file: string;
      added: number;
      removed: number;
    };

export interface SlackState {
  channel: string;
  agent: string;
  history: number;
  draft: string;
  posts: SlackPost[];
  replies: SlackReply[];
  threadOpen: boolean;
}

export interface SceneState {
  terminal: TerminalEntry[];
  /** Set by `terminal.boot`; skins with a persistent footer read it. */
  directory: string | null;
  browser: {
    url: string;
    state: BrowserState;
    blocks: Block[];
    /** Block id at the top of the viewport; `null` is the top of the page. */
    scroll: string | null;
    /** Text of the check badge over the page; `null` hides it. */
    overlay: string | null;
    panel: Panel;
    network: NetworkEntry[];
    console: ConsoleEntry[];
  };
  slack: SlackState;
  cursor: {
    target: string | null;
    label: string | null;
    clicking: boolean;
    tone: CursorTone;
  };
  focus: "terminal" | "browser";
  /** Loop counter; keeps transcript keys unique while old entries animate out. */
  cycle: number;
}

export const initialSceneState: SceneState = {
  browser: {
    blocks: [],
    console: [],
    network: [],
    overlay: null,
    panel: null,
    scroll: null,
    state: "idle",
    url: "localhost:3000",
  },
  cursor: { clicking: false, label: null, target: null, tone: "default" },
  cycle: 0,
  directory: null,
  focus: "terminal",
  slack: {
    agent: "Agent",
    channel: "general",
    draft: "",
    history: 2,
    posts: [],
    replies: [],
    threadOpen: false,
  },
  terminal: [],
};

const MAX_TERMINAL_ENTRIES = 6;

/**
 * Appends a transcript entry. An active spinner is replaced, and the oldest
 * entries are dropped here (not at render time) so a dropped entry can never
 * reappear while its exit animation is still running.
 */
const push = (entries: TerminalEntry[], entry: TerminalEntry) =>
  [...entries.filter((item) => item.kind !== "spinner"), entry].slice(
    -MAX_TERMINAL_ENTRIES
  );

type TerminalStep = Extract<SceneStep, { type: `terminal.${string}` }>;

const isTerminalStep = (step: SceneStep): step is TerminalStep =>
  step.type.startsWith("terminal.");

function applyTerminalStep(
  state: SceneState,
  step: TerminalStep,
  id: string
): SceneState {
  switch (step.type) {
    case "terminal.boot": {
      return {
        ...state,
        directory: step.directory,
        terminal: push(state.terminal, {
          directory: step.directory,
          id,
          kind: "boot",
        }),
      };
    }
    case "terminal.prompt": {
      return {
        ...state,
        terminal: push(state.terminal, { id, kind: "prompt", text: step.text }),
      };
    }
    case "terminal.spinner": {
      return {
        ...state,
        terminal: push(state.terminal, {
          id,
          kind: "spinner",
          message: step.message,
        }),
      };
    }
    case "terminal.line": {
      return {
        ...state,
        terminal: push(state.terminal, {
          id,
          kind: "line",
          text: step.text,
          tone: step.tone ?? "default",
        }),
      };
    }
    case "terminal.diff": {
      return {
        ...state,
        terminal: push(state.terminal, {
          added: step.added,
          file: step.file,
          id,
          kind: "diff",
          removed: step.removed,
        }),
      };
    }
    default: {
      return state;
    }
  }
}

type SlackStep = Extract<SceneStep, { type: `slack.${string}` }>;

const isSlackStep = (step: SceneStep): step is SlackStep =>
  step.type.startsWith("slack.");

function applySlackStep(state: SceneState, step: SlackStep): SceneState {
  switch (step.type) {
    case "slack.channel": {
      return {
        ...state,
        slack: {
          ...initialSceneState.slack,
          agent: step.agent,
          channel: step.name,
          history: step.history ?? initialSceneState.slack.history,
        },
      };
    }
    case "slack.compose": {
      return { ...state, slack: { ...state.slack, draft: step.text } };
    }
    case "slack.post": {
      const { at: _at, type: _type, ...post } = step;
      return {
        ...state,
        slack: {
          ...state.slack,
          draft: "",
          posts: [...state.slack.posts, post],
        },
      };
    }
    case "slack.reply": {
      const { at: _at, type: _type, ...reply } = step;
      return {
        ...state,
        slack: { ...state.slack, replies: [...state.slack.replies, reply] },
      };
    }
    case "slack.thread": {
      return { ...state, slack: { ...state.slack, threadOpen: step.open } };
    }
    default: {
      return state;
    }
  }
}

export function applyStep(
  state: SceneState,
  step: SceneStep,
  index: number
): SceneState {
  const id = `${state.cycle}-${index}`;

  if (isTerminalStep(step)) {
    return applyTerminalStep(state, step, id);
  }
  if (isSlackStep(step)) {
    return applySlackStep(state, step);
  }

  switch (step.type) {
    case "browser.url": {
      return { ...state, browser: { ...state.browser, url: step.url } };
    }
    case "browser.state": {
      return { ...state, browser: { ...state.browser, state: step.state } };
    }
    case "browser.view": {
      return {
        ...state,
        browser: {
          ...state.browser,
          blocks: step.blocks,
          overlay: null,
          scroll: null,
        },
      };
    }
    case "browser.scroll": {
      return { ...state, browser: { ...state.browser, scroll: step.target } };
    }
    case "browser.overlay": {
      return { ...state, browser: { ...state.browser, overlay: step.text } };
    }
    case "browser.panel": {
      return {
        ...state,
        browser: {
          ...state.browser,
          console: step.console ?? state.browser.console,
          network: step.network ?? state.browser.network,
          panel: step.panel,
        },
      };
    }
    case "cursor": {
      return {
        ...state,
        cursor: {
          clicking: step.click ?? false,
          label: step.label ?? state.cursor.label,
          target: step.target,
          tone: step.tone ?? "default",
        },
      };
    }
    case "focus": {
      return { ...state, focus: step.target };
    }
    default: {
      return state;
    }
  }
}

/** Replays every step at or before `time`. Used for reduced motion. */
export function stateAt(scene: Scene, time: number): SceneState {
  let state = initialSceneState;
  for (const [index, step] of scene.steps.entries()) {
    if (step.at <= time) {
      state = applyStep(state, step, index);
    }
  }
  return state;
}

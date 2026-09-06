import type { JSX } from "react";

/**
 * What a terminal "skin" must provide. The scene decides what happens;
 * the skin decides how an agent (Claude Code, Codex…) draws it.
 */
export interface AgentSkin {
  /** Window title, e.g. the CLI's command name. */
  title: string;
  /** Start-up screen shown by `terminal.boot`. */
  Banner: (props: { directory: string }) => JSX.Element;
  /** A submitted user prompt. */
  Prompt: (props: { text: string }) => JSX.Element;
  /** "Thinking" indicator. Skins may ignore `message`. */
  Spinner: (props: { message: string }) => JSX.Element;
  /** A file edit summary. */
  Diff: (props: {
    file: string;
    added: number;
    removed: number;
  }) => JSX.Element;
  /** Persistent input area at the bottom, for CLIs that always show one. */
  Footer?: (props: { directory: string }) => JSX.Element;
}

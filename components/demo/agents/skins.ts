import { claudeCode } from "./claude-code/skin";
import { codex } from "./codex/skin";
import type { AgentSkin } from "./types";

/** Registry used by `site.demo.agent`. Add a folder and a line here for a new CLI. */
export const skins = {
  "claude-code": claudeCode,
  codex,
} satisfies Record<string, AgentSkin>;

export type AgentName = keyof typeof skins;

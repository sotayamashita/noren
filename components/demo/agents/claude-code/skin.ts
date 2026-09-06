import type { AgentSkin } from "../types";
import { ClaudeCodeBanner } from "./banner";
import { ClaudeCodeDiff } from "./diff";
import { ClaudeCodePrompt } from "./prompt";
import { ClaudeCodeSpinner } from "./spinner";

export const claudeCode: AgentSkin = {
  Banner: ClaudeCodeBanner,
  Diff: ClaudeCodeDiff,
  Prompt: ClaudeCodePrompt,
  Spinner: ClaudeCodeSpinner,
  title: "claude",
};

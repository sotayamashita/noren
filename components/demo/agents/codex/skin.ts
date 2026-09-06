import type { AgentSkin } from "../types";
import { CodexBanner } from "./banner";
import { CodexDiff } from "./diff";
import { CodexFooter } from "./footer";
import { CodexPrompt } from "./prompt";
import { CodexSpinner } from "./spinner";

export const codex: AgentSkin = {
  Banner: CodexBanner,
  Diff: CodexDiff,
  Footer: CodexFooter,
  Prompt: CodexPrompt,
  Spinner: CodexSpinner,
  title: "codex",
};

import type { AgentName } from "@/components/demo/agents/skins";

/**
 * Locale-independent site configuration.
 * Copy lives in content/{locale}/site.json, the demo timeline in content/{en,ja}/demo.ts.
 */
export const site = {
  /** Author shown in metadata. */
  author: "Your Name",
  /** Which CLI the demo terminal imitates. See components/demo/agents/skins.ts. */
  demo: { agent: "claude-code" as AgentName },
  /** Labels for the language switcher, keyed by locale. */
  localeLabels: {
    en: "English",
    ja: "日本語",
  },
  name: "Noren",
  /** "owner/repo" on GitHub. Set to null to hide the star button. */
  repo: "sotayamashita/noren" as string | null,
  url: "https://noren.example.com",
} as const;

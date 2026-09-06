import type { AgentName } from "@/components/demo/agents/skins";

/**
 * Locale-independent site configuration.
 * Copy lives in messages/*.json, the demo timeline in content/demo/scene.ts.
 */
export const site = {
  /** Author shown in metadata. */
  author: "Your Name",
  /** Which CLI the demo terminal imitates. See components/demo/agents/skins.ts. */
  demo: { agent: "claude-code" as AgentName },
  /**
   * Tabs in the install card; the first is selected by default.
   * A tab shows either one `command`, or a dropdown of `options` (for example one
   * per agent) each with its own command. Multi-line commands are fine.
   */
  install: [
    {
      id: "cli",
      options: [
        {
          command:
            "claude mcp add --scope user showcase -- npx -y showcase@latest mcp",
          id: "claude-code",
          label: "Claude Code",
        },
        {
          command: "codex mcp add showcase -- npx -y showcase@latest mcp",
          id: "codex",
          label: "Codex",
        },
        {
          command: `{
  "mcpServers": {
    "showcase": { "command": "npx", "args": ["-y", "showcase@latest", "mcp"] }
  }
}`,
          id: "cursor",
          label: "Cursor",
        },
      ],
    },
    {
      command:
        "fetch https://showcase.example.com/llms.txt and run the init script",
      id: "prompt",
    },
  ],
  /** Labels for the language switcher, keyed by locale. */
  localeLabels: {
    en: "English",
    ja: "日本語",
  },
  name: "Showcase",
  /** "owner/repo" on GitHub. Set to null to hide the star button. */
  repo: "your-org/showcase" as string | null,
  url: "https://showcase.example.com",
} as const;

export type InstallTab = (typeof site.install)[number];
export type InstallTabId = InstallTab["id"];

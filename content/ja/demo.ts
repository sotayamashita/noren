import type { Scene } from "@/lib/demo/scene";

/**
 * デモのタイムライン: コーディングエージェントが複製したばかりのテンプレートを
 * プロダクトのページに書き換え、ブラウザにページが現れ、Agentation で注釈が
 * 1 つ届き、エージェントが直し、仕上がったガイドをブラウザがスクロールして
 * ビルドが通る。
 *
 * 別のプロダクト用に書くときは content/en/demo.ts のコメントを参照。
 */
const page = [
  { id: "demo", kind: "demo" },
  { id: "headline", kind: "heading" },
  { id: "subheadline", kind: "text" },
  { id: "install-title", kind: "heading", label: "インストール" },
  { id: "install", kind: "code" },
  { id: "steps-title", kind: "heading", label: "はじめかた" },
  { id: "steps", kind: "steps" },
  { id: "features-title", kind: "heading", label: "機能の一覧" },
  { id: "features", kind: "cards" },
  { id: "faq-title", kind: "heading", label: "よくある質問" },
  { id: "faq", kind: "faq" },
  { id: "star", kind: "button", label: "GitHub でスターする" },
] as const;

export const demoScene: Scene = {
  duration: 14_500,
  steps: [
    // Beat 1: 複製したばかりのテンプレートでエージェントが起動する。
    { at: 0, target: "terminal", type: "focus" },
    { at: 0, directory: "~/my-awesome-product", type: "terminal.boot" },
    {
      at: 600,
      text: "AGENTS.md に従って、これを Acme CLI のページにして",
      type: "terminal.prompt",
    },

    // Beat 2: プロダクトを読み、content を書く。
    {
      at: 1300,
      message: "acme-cli/README.md を読んでいます…",
      type: "terminal.spinner",
    },
    {
      at: 2100,
      text: "README.md、docs/usage.md を読みました",
      tone: "muted",
      type: "terminal.line",
    },
    { at: 2300, message: "content を書いています…", type: "terminal.spinner" },
    {
      added: 3,
      at: 3000,
      file: "content/ja/site.json",
      removed: 3,
      type: "terminal.diff",
    },
    {
      added: 46,
      at: 3300,
      file: "content/ja/demo.ts",
      removed: 41,
      type: "terminal.diff",
    },
    {
      added: 28,
      at: 3600,
      file: "content/ja/guide.mdx",
      removed: 22,
      type: "terminal.diff",
    },

    // Beat 3: ブラウザにページが現れる。
    { at: 3900, blocks: [...page], type: "browser.view" },
    { at: 3900, type: "browser.url", url: "localhost:3000/ja" },
    { at: 3900, state: "loading", type: "browser.state" },
    { at: 3900, target: "browser", type: "focus" },
    { at: 4500, state: "ok", type: "browser.state" },

    // Beat 4: Agentation で注釈を 1 つ送る。
    {
      at: 4800,
      label: "見出しをもっと短く",
      target: "headline",
      type: "cursor",
    },
    { at: 5400, click: true, target: "headline", type: "cursor" },

    // Beat 5: エージェントが受け取り、文言を直す。
    { at: 5700, target: "terminal", type: "focus" },
    {
      at: 5700,
      text: "h1 への注釈: 見出しをもっと短く",
      tone: "muted",
      type: "terminal.line",
    },
    { at: 5900, message: "書き直しています…", type: "terminal.spinner" },
    {
      added: 1,
      at: 6700,
      file: "content/ja/site.json",
      removed: 1,
      type: "terminal.diff",
    },

    // Beat 6: 注釈が解決する。
    { at: 7000, target: "browser", type: "focus" },
    { at: 7000, target: "headline", tone: "success", type: "cursor" },
    { at: 7700, target: null, type: "cursor" },

    // Beat 7: 仕上がったガイドをブラウザがスクロールする。
    { at: 7800, target: "install-title", type: "browser.scroll" },
    { at: 8500, target: "steps-title", type: "browser.scroll" },
    { at: 9200, target: "features-title", type: "browser.scroll" },
    { at: 9900, target: "faq-title", type: "browser.scroll" },

    // Beat 8: ビルドが通る。
    { at: 10_600, target: "terminal", type: "focus" },
    {
      at: 10_600,
      text: "✓ just build (en, ja)",
      tone: "success",
      type: "terminal.line",
    },
    // Beat 9: ブラウザが前に出て札を見せ、そのまま止まる。reduced motion では
    // このフレームだけが出る。
    { at: 11_200, target: "browser", type: "focus" },
    { at: 11_200, text: "公開できます", type: "browser.overlay" },
  ],
};

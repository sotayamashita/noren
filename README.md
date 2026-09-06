# Showcase

A landing page template for what you just built, for developers who build with coding agents. One page with a looping demo, install commands and a guide, in English and Japanese, with light, dark and system themes. You copy the template; your coding agent writes the page from your product's repository; people see it work, try it, and open an issue when they have something to say.

## Use it

1. **Install.** Create a repository from this template with the "Use this template" button on GitHub, or from the terminal:

   ```bash
   gh repo create my-awesome-product --template sotayamashita/showcase --private --clone
   ```

2. **Set up.** Tool versions come from `mise.toml`.

   ```bash
   mise install
   just setup
   ```

3. **Develop.** Start the dev server, open http://localhost:3000 (`/ja` for Japanese), then open the repository in Claude Code or Codex and ask:

   ```bash
   just dev
   ```

   > Follow the Customising section in AGENTS.md. My product is at github.com/you/your-tool. Read its README and write this page for it.

   The agent edits `content/` only: site settings, hero copy, the demo timeline and the guide.

4. **Check.** Say "watch mode" to your agent, then use the [Agentation](https://www.agentation.com/) toolbar on the page: click an element, write what should change, send it. The agent fixes each note. When the page reads right:

   ```bash
   just check-demo
   just build
   ```

5. **Deploy.** Set `url` in `content/site.ts` to the public address, push, and import the repository on Vercel or any other host that runs Next.js.

6. **Share.** Post the link where your users are. The page links back to your GitHub Issues so feedback has somewhere to go.

## Commands

`just` lists every recipe. The ones you will use most:

| Command | Purpose |
| --- | --- |
| `just dev` | Dev server on http://localhost:3000 |
| `just build` | Production build; the definitive check for routing and i18n |
| `just check` / `just fix` | Lint and format |
| `just check-demo` | Validate the demo timeline |

## For agents

`AGENTS.md` (also linked as `CLAUDE.md`) carries the conventions, the content boundaries and a step-by-step guide to writing a demo scene. During `just dev`, `/dev/demo` and `/dev/guide` show every demo state and every guide element in both themes, and the Agentation toolbar sends annotations from the browser to the agent.

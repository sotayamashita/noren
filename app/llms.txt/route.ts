import messages from "@/content/en/site.json";
import { site } from "@/content/site";

// Plain-text summary for agents and LLM crawlers, built from the same copy as the page.
export function GET() {
  const { meta } = messages;
  const body = `# ${meta.title}

> ${meta.description}

Website: ${site.url}
${site.repo ? `Repository: https://github.com/${site.repo}\n` : ""}
## Guide

- [Usage and FAQ](${site.url}): Installation, workflow, and frequently asked questions.
`;

  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

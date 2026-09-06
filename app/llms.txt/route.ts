import { site } from "@/content/site";
import messages from "@/messages/en.json";

// Plain-text summary for agents and LLM crawlers, built from the same copy as the page.
export function GET() {
  const { meta, steps, faq } = messages;
  const body = `# ${meta.title}

> ${meta.description}

Website: ${site.url}
${site.repo ? `Repository: https://github.com/${site.repo}\n` : ""}
## Install

${site.install.flatMap((tab) => ("options" in tab ? tab.options.map((o) => `- ${o.label}: ${o.command}`) : [`- ${tab.command}`])).join("\n")}

## ${steps.heading}

${steps.items.map((item, index) => `${index + 1}. ${item.title}\n   ${item.body}`).join("\n")}

## ${faq.heading}

${faq.items.map((item) => `### ${item.question}\n${item.answer}`).join("\n\n")}
`;

  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

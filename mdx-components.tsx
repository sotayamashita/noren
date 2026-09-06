import type { MDXComponents } from "mdx/types";

import { CodeBlock } from "@/components/code-block";

// Typeset (app/typeset.css) styles the rendered markdown; only code blocks need
// behaviour (a copy button).
const components: MDXComponents = {
  pre: CodeBlock,
};

export function useMDXComponents(): MDXComponents {
  return components;
}

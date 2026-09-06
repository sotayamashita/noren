import type { MDXComponents } from "mdx/types";

import { CodeBlock } from "@/components/guide/code-block";
import { Link } from "@/components/link";

// Typeset (app/typeset.css) styles the rendered markdown. Code blocks need a
// copy button; links need locale-aware paths and new-tab handling for external
// URLs.
const components: MDXComponents = {
  a: Link,
  pre: CodeBlock,
};

export function useMDXComponents(): MDXComponents {
  return components;
}

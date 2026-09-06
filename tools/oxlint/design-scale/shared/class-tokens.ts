import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";

type Literal =
  | ESTree.StringLiteral
  | ESTree.BooleanLiteral
  | ESTree.NullLiteral
  | ESTree.NumericLiteral
  | ESTree.BigIntLiteral
  | ESTree.RegExpLiteral;

const CLASS_ATTRIBUTES = new Set(["className", "class"]);
const CLASS_HELPERS = new Set(["cn", "cva", "clsx", "cx"]);

/** Drops variant prefixes such as `sm:` or `hover:` from a class token. */
export function stripVariants(token: string): string {
  const index = token.lastIndexOf(":");
  return index === -1 ? token : token.slice(index + 1);
}

/** True for Tailwind arbitrary values: `[7px]` or `(--custom)`. */
export const isArbitrary = (value: string): boolean =>
  value.startsWith("[") || value.startsWith("(");

/** True when the string sits in a `className` attribute or a `cn()`-style call. */
function isClassContext(node: ESTree.Node): boolean {
  let current: ESTree.Node | null = node.parent;
  while (current) {
    if (current.type === "JSXAttribute") {
      const { name } = current;
      return name.type === "JSXIdentifier" && CLASS_ATTRIBUTES.has(name.name);
    }
    if (current.type === "CallExpression") {
      const { callee } = current;
      return callee.type === "Identifier" && CLASS_HELPERS.has(callee.name);
    }
    if (current.type === "JSXElement" || current.type === "Program") {
      return false;
    }
    current = current.parent;
  }
  return false;
}

interface ClassTokenRuleOptions {
  description: string;
  message: string;
  /** Returns true for a class token that should be reported. */
  offends: (token: string) => boolean;
}

/** Builds a rule that reports every class token in class contexts matching `offends`. */
export function classTokenRule({
  description,
  message,
  offends,
}: ClassTokenRuleOptions) {
  return defineRule({
    createOnce(context) {
      const check = (node: ESTree.Node, text: string) => {
        if (!isClassContext(node)) {
          return;
        }
        for (const token of text.split(/\s+/u)) {
          if (token && offends(token)) {
            context.report({ data: { token }, messageId: "offScale", node });
          }
        }
      };

      return {
        Literal(node: Literal) {
          if (typeof node.value === "string") {
            check(node, node.value);
          }
        },
        TemplateElement(node: ESTree.TemplateElement) {
          check(node, node.value.cooked ?? node.value.raw);
        },
      };
    },
    meta: {
      docs: { description },
      messages: { offScale: message },
      type: "suggestion",
    },
  });
}

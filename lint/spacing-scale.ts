import { definePlugin, defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";

/**
 * Spacing steps allowed in class names, as multiples of `--spacing` (4px).
 * The ladder and each step's role are recorded in docs/adr/0001-spacing-and-radius-scale.md.
 */
const LADDER = new Set([1, 2, 3, 4, 6, 8, 12, 16, 24]);

/** Utilities that set padding, margin, gap or inset. */
const SPACING_PREFIX =
  /^-?(?:p|px|py|pt|pb|ps|pe|pl|pr|m|mx|my|mt|mb|ms|me|ml|mr|gap|gap-x|gap-y|space-x|space-y|inset|inset-x|inset-y|top|bottom|start|end|left|right)-(?<value>.+)$/u;

/** Non-numeric values that never encode a distance on the scale. */
const KEYWORD_VALUES = new Set(["0", "px", "auto", "full", "screen"]);

const CLASS_ATTRIBUTES = new Set(["className", "class"]);
const CLASS_HELPERS = new Set(["cn", "cva", "clsx", "cx"]);

function stripVariants(token: string): string {
  const index = token.lastIndexOf(":");
  return index === -1 ? token : token.slice(index + 1);
}

/** Returns the offending value for a utility, or null when the token is fine. */
function offLadderValue(token: string): string | null {
  const match = SPACING_PREFIX.exec(stripVariants(token));
  if (!match) {
    return null;
  }
  const value = match.groups?.["value"] ?? "";
  if (KEYWORD_VALUES.has(value) || value.includes("/")) {
    return null;
  }
  if (value.startsWith("[") || value.startsWith("(")) {
    return value;
  }
  const step = Number(value);
  if (Number.isNaN(step)) {
    return null;
  }
  return LADDER.has(step) ? null : value;
}

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

const onLadder = defineRule({
  createOnce(context) {
    const check = (node: ESTree.Node, text: string) => {
      if (!isClassContext(node)) {
        return;
      }
      for (const token of text.split(/\s+/u)) {
        if (token && offLadderValue(token) !== null) {
          context.report({ data: { token }, messageId: "offLadder", node });
        }
      }
    };

    return {
      Literal(
        node:
          | ESTree.StringLiteral
          | ESTree.BooleanLiteral
          | ESTree.NullLiteral
          | ESTree.NumericLiteral
          | ESTree.BigIntLiteral
          | ESTree.RegExpLiteral
      ) {
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
    docs: {
      description:
        "Padding, margin, gap and inset utilities use only the spacing steps 1, 2, 3, 4, 6, 8, 12, 16 and 24.",
    },
    messages: {
      offLadder:
        "`{{token}}` is off the spacing scale. Pick the role it belongs to and use one of 1, 2, 3, 4, 6, 8, 12, 16, 24 (docs/adr/0001-spacing-and-radius-scale.md).",
    },
    type: "suggestion",
  },
});

/** Local oxlint plugin: keeps spacing on the 4px ladder from ADR-0001. */
const spacingScalePlugin = definePlugin({
  meta: { name: "spacing-scale" },
  rules: { "on-ladder": onLadder },
});

export default spacingScalePlugin;

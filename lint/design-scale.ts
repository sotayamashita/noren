import { definePlugin, defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";

/**
 * Spacing steps allowed in class names, as multiples of `--spacing` (4px).
 * The ladder, the radius tokens and each step's role are recorded in
 * docs/adr/0001-spacing-and-radius-scale.md.
 */
const LADDER = new Set([1, 2, 3, 4, 6, 8, 12, 16, 24]);

/** Utilities that set padding, margin, gap or inset. */
const SPACING_PREFIX =
  /^-?(?:p|px|py|pt|pb|ps|pe|pl|pr|m|mx|my|mt|mb|ms|me|ml|mr|gap|gap-x|gap-y|space-x|space-y|inset|inset-x|inset-y|top|bottom|start|end|left|right)-(?<value>.+)$/u;

/** Utilities that set a border radius, on any side or corner. */
const RADIUS_PREFIX =
  /^rounded(?:-(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?-(?<value>.+)$/u;

/** Non-numeric spacing values that never encode a distance on the scale. */
const KEYWORD_VALUES = new Set(["0", "px", "auto", "full", "screen"]);

const CLASS_ATTRIBUTES = new Set(["className", "class"]);
const CLASS_HELPERS = new Set(["cn", "cva", "clsx", "cx"]);

type Literal =
  | ESTree.StringLiteral
  | ESTree.BooleanLiteral
  | ESTree.NullLiteral
  | ESTree.NumericLiteral
  | ESTree.BigIntLiteral
  | ESTree.RegExpLiteral;

function stripVariants(token: string): string {
  const index = token.lastIndexOf(":");
  return index === -1 ? token : token.slice(index + 1);
}

const isArbitrary = (value: string): boolean =>
  value.startsWith("[") || value.startsWith("(");

/** True when a spacing utility uses a step outside the ladder or an arbitrary value. */
function isOffLadder(token: string): boolean {
  const match = SPACING_PREFIX.exec(stripVariants(token));
  if (!match) {
    return false;
  }
  const value = match.groups?.["value"] ?? "";
  if (KEYWORD_VALUES.has(value) || value.includes("/")) {
    return false;
  }
  if (isArbitrary(value)) {
    return true;
  }
  const step = Number(value);
  return !(Number.isNaN(step) || LADDER.has(step));
}

/** True when a radius utility bypasses the `--radius-*` tokens with an arbitrary value. */
function isOffTokens(token: string): boolean {
  const match = RADIUS_PREFIX.exec(stripVariants(token));
  return match !== null && isArbitrary(match.groups?.["value"] ?? "");
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

/** Builds a rule that reports every class token matching `offends`. */
function classTokenRule(
  description: string,
  message: string,
  offends: (token: string) => boolean
) {
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

const spacing = classTokenRule(
  "Padding, margin, gap and inset utilities use only the spacing steps 1, 2, 3, 4, 6, 8, 12, 16 and 24.",
  "`{{token}}` is off the spacing scale. Pick the role it belongs to and use one of 1, 2, 3, 4, 6, 8, 12, 16, 24 (docs/adr/0001-spacing-and-radius-scale.md).",
  isOffLadder
);

const radius = classTokenRule(
  "Radius utilities use the named tokens (sm, md, lg, xl, 2xl, full), never an arbitrary value.",
  "`{{token}}` bypasses the radius tokens. Use rounded-sm, md, lg, xl, 2xl or full; their values share the 4px unit (docs/adr/0001-spacing-and-radius-scale.md).",
  isOffTokens
);

/** Local oxlint plugin: keeps spacing and radius on the 4px scale from ADR-0001. */
const designScalePlugin = definePlugin({
  meta: { name: "design-scale" },
  rules: { radius, spacing },
});

export default designScalePlugin;

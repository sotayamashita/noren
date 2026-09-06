import {
  classTokenRule,
  isArbitrary,
  stripVariants,
} from "../shared/class-tokens.ts";

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

/** Padding, margin, gap and inset utilities stay on the spacing ladder. */
export const spacingRule = classTokenRule({
  description:
    "Padding, margin, gap and inset utilities use only the spacing steps 1, 2, 3, 4, 6, 8, 12, 16 and 24.",
  message:
    "`{{token}}` is off the spacing scale. Pick the role it belongs to and use one of 1, 2, 3, 4, 6, 8, 12, 16, 24 (docs/adr/0001-spacing-and-radius-scale.md).",
  offends: isOffLadder,
});

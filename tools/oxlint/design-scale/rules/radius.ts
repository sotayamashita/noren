import {
  classTokenRule,
  isArbitrary,
  stripVariants,
} from "../shared/class-tokens.ts";

/** Utilities that set a border radius, on any side or corner. */
const RADIUS_PREFIX =
  /^rounded(?:-(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?-(?<value>.+)$/u;

/** True when a radius utility bypasses the `--radius-*` tokens with an arbitrary value. */
function isOffTokens(token: string): boolean {
  const match = RADIUS_PREFIX.exec(stripVariants(token));
  return match !== null && isArbitrary(match.groups?.["value"] ?? "");
}

/** Radius utilities use the named tokens, whose values share the 4px unit. */
export const radiusRule = classTokenRule({
  description:
    "Radius utilities use the named tokens (sm, md, lg, xl, 2xl, full), never an arbitrary value.",
  message:
    "`{{token}}` bypasses the radius tokens. Use rounded-sm, md, lg, xl, 2xl or full; their values share the 4px unit (docs/adr/0001-spacing-and-radius-scale.md).",
  offends: isOffTokens,
});

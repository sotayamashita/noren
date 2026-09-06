import { definePlugin } from "@oxlint/plugins";

import { radiusRule } from "./rules/radius.ts";
import { spacingRule } from "./rules/spacing.ts";

/** Local oxlint plugin: keeps spacing and radius on the 4px scale from ADR-0001. */
const designScalePlugin = definePlugin({
  meta: { name: "design-scale" },
  rules: { radius: radiusRule, spacing: spacingRule },
});

export default designScalePlugin;

// Sanity checks for content/{en,ja}/demo.ts. Run with `just check-demo`.
// Node 24 strips the types itself, so this needs no build step.
import assert from "node:assert/strict";

import { demoScene as enDemo } from "../../content/en/demo.ts";
import { demoScene as jaDemo } from "../../content/ja/demo.ts";
import { slackScene } from "../../gallery/demo/slack.ts";
import type { Scene } from "../../lib/demo/scene.ts";

for (const [name, scene] of Object.entries({ enDemo, jaDemo, slackScene })) {
  check(name, scene);
}

function check(name: string, { duration, steps }: Scene) {
  const anchors = new Set<string>();
  let previous = 0;

  for (const [index, step] of steps.entries()) {
    const where = `step ${index} (${step.type} at ${step.at})`;
    assert.ok(step.at >= previous, `${where}: steps must be sorted by "at"`);
    assert.ok(
      step.at < duration,
      `${where}: "at" must be below duration ${duration}`
    );
    previous = step.at;

    if (step.type === "browser.view") {
      for (const block of step.blocks) {
        anchors.add(block.id);
      }
    }
    if (step.type === "slack.post") {
      anchors.add(`${step.id}-replies`);
    }
    if (step.type === "slack.reply") {
      for (const item of [
        ...(step.attachments ?? []),
        ...(step.actions ?? []),
      ]) {
        anchors.add(item.id);
      }
    }
    if (step.type === "cursor" && step.target !== null) {
      assert.ok(
        anchors.has(step.target),
        `${where}: target "${step.target}" is not a block id from an earlier browser.view`
      );
    }
    if (step.type === "browser.scroll" && step.target !== null) {
      assert.ok(
        anchors.has(step.target),
        `${where}: target "${step.target}" is not a block id from an earlier browser.view`
      );
    }
    if (step.type === "browser.panel" && step.panel !== null) {
      const { panel } = step;
      const provided = steps
        .slice(0, index + 1)
        .some((s) => s.type === "browser.panel" && s[panel] !== undefined);
      assert.ok(provided, `${where}: no ${panel} entries provided`);
    }
  }

  console.log(`${name} ok: ${steps.length} steps, ${duration} ms`);
}

import type { ReactNode } from "react";

import { skins } from "@/components/demo/agents/skins";
import type { AgentName } from "@/components/demo/agents/skins";
import { DemoStage } from "@/components/demo/stage";
import type { Scene } from "@/lib/demo/scene";

import { slackScene } from "./slack";
import { DemoStates } from "./states";

export function DemoGallery({
  scene,
  agent,
}: {
  scene: Scene;
  agent: AgentName;
}): ReactNode {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">
          Live demo{" "}
          <span className="text-muted-foreground font-mono text-sm">
            agent={agent}
          </span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Switch with{" "}
          {Object.keys(skins).map((name) => (
            <a className="me-3 underline" href={`?agent=${name}`} key={name}>
              ?agent={name}
            </a>
          ))}
        </p>
        <ThemePreview>
          <DemoStage agent={agent} scene={scene} />
        </ThemePreview>
      </section>
      <section className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">
          Live demo{" "}
          <span className="text-muted-foreground font-mono text-sm">
            layout=slack
          </span>
        </h1>
        <ThemePreview>
          <DemoStage scene={slackScene} />
        </ThemePreview>
      </section>
      <DemoStates />
    </div>
  );
}

function ThemePreview({ children }: { children: ReactNode }): ReactNode {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(["light", "dark"] as const).map((theme) => (
        <div
          className={`${theme} bg-background text-foreground flex justify-center rounded-xl border p-6`}
          data-theme={theme}
          key={theme}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

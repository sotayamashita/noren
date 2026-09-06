"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { domAnimation, LazyMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import type { Scene } from "@/lib/demo/scene";

import { skins } from "./agents/skins";
import type { AgentName } from "./agents/skins";
import { BrowserWindow } from "./browser/window";
import { MacCursor } from "./mac/cursor";
import { SlackWindow } from "./slack/window";
import { Terminal } from "./terminal";
import { useScene } from "./use-scene";

/** Fixed design size; the stage scales down to fit its container. */
const STAGE = { height: 400, width: 720 } as const;

const BROWSER = { height: 320, left: 0, top: 0, width: 460 };
const TERMINAL = { height: 260, left: 320, top: 120, width: 400 };

interface DemoStageProps {
  scene: Scene;
  /** Overrides `site.demo.agent`; used by the dev gallery. */
  agent?: AgentName;
}

export function DemoStage({ scene, agent }: DemoStageProps) {
  const t = useTranslations("demo");
  const [playing, setPlaying] = useState(true);
  const { state, reducedMotion } = useScene(scene, playing);
  const { ref, scale } = useStageScale();
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  const skin = skins[agent ?? site.demo.agent];

  return (
    <figure className="m-0 w-full">
      <div
        className="relative mx-auto w-full"
        ref={ref}
        style={{
          aspectRatio: `${STAGE.width} / ${STAGE.height}`,
          maxWidth: STAGE.width,
        }}
      >
        {/* The windows are an illustration; the figcaption describes them. */}
        <LazyMotion features={domAnimation} strict>
          <div
            aria-hidden
            className="absolute top-0 left-0 origin-top-left"
            ref={setStage}
            style={{ height: STAGE.height, scale, width: STAGE.width }}
          >
            {scene.layout === "slack" ? (
              <SlackWindow slack={state.slack} style={{ inset: 0 }} />
            ) : (
              <>
                <BrowserWindow
                  browser={state.browser}
                  focused={state.focus === "browser"}
                  style={BROWSER}
                />
                <Terminal
                  directory={state.directory}
                  entries={state.terminal}
                  focused={state.focus === "terminal"}
                  skin={skin}
                  style={TERMINAL}
                />
              </>
            )}
            <MacCursor {...state.cursor} stage={stage} />
          </div>
        </LazyMotion>
        {/* WCAG 2.2.2: anything that moves for more than 5s needs a visible pause. */}
        {reducedMotion ? null : (
          <Button
            aria-label={playing ? t("pause") : t("play")}
            aria-pressed={!playing}
            className="absolute end-0 bottom-0"
            onClick={() => setPlaying((current) => !current)}
            size="icon-sm"
            variant="outline"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </Button>
        )}
      </div>
      <figcaption className="sr-only">
        {reducedMotion ? t("reducedMotion") : t("caption")}
      </figcaption>
    </figure>
  );
}

/** Scale factor so the fixed-size stage fills its (narrower) container. */
function useStageScale() {
  const [scale, setScale] = useState(1);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const update = () => {
      setScale(Math.min(1, element.clientWidth / STAGE.width));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, scale };
}

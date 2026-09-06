"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import type { Scene, SceneState } from "@/lib/demo/scene";
import { applyStep, initialSceneState, stateAt } from "@/lib/demo/scene";

/**
 * Plays a scene on a timer and loops it. With reduced motion enabled the
 * final frame is returned as a static illustration instead. `playing: false`
 * freezes the current frame; resuming restarts the loop.
 */
export function useScene(scene: Scene, playing = true) {
  const reducedMotion = useReducedMotion() === true;
  const [state, setState] = useState<SceneState>(initialSceneState);

  useEffect(() => {
    if (reducedMotion || !playing) {
      return;
    }

    let timers: number[] = [];

    const clear = () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
      timers = [];
    };

    // `reset` is false on mount because state already starts at the first frame.
    const play = (reset: boolean) => {
      clear();
      if (reset) {
        setState((previous) => ({
          ...initialSceneState,
          cycle: previous.cycle + 1,
        }));
      }
      timers = scene.steps.map((step, index) =>
        window.setTimeout(() => {
          setState((previous) => applyStep(previous, step, index));
        }, step.at)
      );
      timers.push(window.setTimeout(() => play(true), scene.duration));
    };

    // Timers drift while the tab is hidden; restart cleanly when it returns.
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        play(true);
      } else {
        clear();
      }
    };

    // A hidden document pauses requestAnimationFrame but not timers, so entries
    // would pile up unanimated. Start only once the page is actually visible.
    if (document.visibilityState === "visible") {
      play(false);
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clear();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [scene, reducedMotion, playing]);

  return {
    reducedMotion,
    state: reducedMotion ? stateAt(scene, scene.duration) : state,
  };
}

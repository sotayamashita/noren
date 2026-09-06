"use client";

import { m } from "motion/react";
import { useEffect, useState } from "react";

import type { CursorTone } from "@/lib/demo/scene";

interface MacCursorProps {
  /** `data-anchor` id inside the stage; `null` hides the cursor. */
  target: string | null;
  label: string | null;
  clicking: boolean;
  tone: CursorTone;
  /** The scaled stage element; anchors are measured relative to it. */
  stage: HTMLElement | null;
}

const MOVE_SPRING = { damping: 22, stiffness: 180, type: "spring" } as const;
/** Where the cursor waits while hidden, in stage px (below the browser window). */
const PARKED = { x: 240, y: 360 };
/** A short head-shake; runs once each time the tone becomes `error`. */
const SHAKE = [0, -3, 3, -2, 2, -1, 1, 0].map((x) => `translateX(${x}px)`);

const toneFill: Record<CursorTone, string> = {
  default: "var(--foreground)",
  error: "var(--destructive)",
  success: "var(--success)",
};

const toneMark: Record<CursorTone, string | null> = {
  default: null,
  error: "✗",
  success: "✓",
};

export function MacCursor({
  target,
  label,
  clicking,
  tone,
  stage,
}: MacCursorProps) {
  const point = useAnchor(target, stage);
  const visible = target !== null && point !== null;
  const { x, y } = point ?? PARKED;
  const mark = toneMark[tone];

  return (
    <m.div
      animate={{
        opacity: visible ? 1 : 0,
        transform: `translate(${x}px, ${y}px) scale(${clicking ? 0.85 : 1})`,
      }}
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 z-10"
      initial={false}
      transition={{ ...MOVE_SPRING, opacity: { duration: 0.2 } }}
    >
      {/* Arrow copied from expect.dev: white outline with a soft shadow, tinted inner path. */}
      <m.svg
        animate={{ transform: tone === "error" ? SHAKE : "translateX(0px)" }}
        fill="none"
        height="32"
        style={{ height: "auto", width: 32 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        viewBox="0 0 32 32"
        width="32"
      >
        <g filter="url(#demo-cursor-shadow)">
          <path
            d="M2.59 2.59C3.14 2.03 3.97 1.85 4.7 2.13L15.7 6.25C16.52 6.56 17.05 7.37 17 8.24C16.95 9.11 16.33 9.85 15.49 10.07L11.15 11.15L10.07 15.49C9.85 16.33 9.11 16.95 8.24 17C7.37 17.05 6.56 16.52 6.25 15.7L2.13 4.7C1.85 3.97 2.03 3.14 2.59 2.59Z"
            fill="var(--background)"
            stroke="var(--background)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </g>
        <path
          clipRule="evenodd"
          d="M4.18 3.53C3.99 3.46 3.79 3.51 3.65 3.65C3.51 3.79 3.46 3.99 3.53 4.18L7.66 15.18C7.73 15.38 7.93 15.51 8.15 15.5C8.37 15.49 8.56 15.33 8.61 15.12L9.91 9.91L15.12 8.61C15.33 8.56 15.49 8.37 15.5 8.15C15.51 7.93 15.38 7.73 15.18 7.66L4.18 3.53Z"
          fill={toneFill[tone]}
          fillRule="evenodd"
          stroke={toneFill[tone]}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="19"
            id="demo-cursor-shadow"
            width="19"
            x="0"
            y="0"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.22 0"
            />
            <feBlend
              in2="BackgroundImageFix"
              mode="normal"
              result="effect1_dropShadow"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow"
              mode="normal"
              result="shape"
            />
          </filter>
        </defs>
      </m.svg>
      {label || mark ? (
        <span className="bg-background text-foreground absolute top-4 left-4 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] leading-none font-medium whitespace-nowrap shadow-[0_0_0_0.5px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.06)]">
          {mark === "✗" ? (
            <svg className="size-3.5" fill="none" viewBox="0 0 16 16">
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="var(--destructive)"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
            </svg>
          ) : null}
          {mark === "✓" ? (
            <svg className="size-3.5" fill="none" viewBox="0 0 16 16">
              <path
                d="M3 8.5L6.5 12L13 4"
                stroke="var(--success)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
            </svg>
          ) : null}
          {label}
        </span>
      ) : null}
    </m.div>
  );
}

/**
 * Centre of the anchored element in stage px. Measured through a
 * ResizeObserver so it follows layout changes and the stage scale.
 */
function useAnchor(target: string | null, stage: HTMLElement | null) {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const anchor = target
      ? stage?.querySelector<HTMLElement>(`[data-anchor="${target}"]`)
      : null;
    if (!(stage && anchor)) {
      return;
    }
    const observer = new ResizeObserver(() => {
      const box = stage.getBoundingClientRect();
      const rect = anchor.getBoundingClientRect();
      const scale = box.width / stage.offsetWidth;
      setPoint({
        x: (rect.left + rect.width / 2 - box.left) / scale,
        y: (rect.top + rect.height / 2 - box.top) / scale,
      });
    });
    observer.observe(stage);
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [target, stage]);

  return point;
}

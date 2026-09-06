"use client";

import { Agentation } from "agentation";
import type { ReactNode } from "react";

/** Development-only annotation toolbar; the static NODE_ENV check drops it from production builds. */
export function DevAgentation(): ReactNode {
  return process.env.NODE_ENV === "development" ? (
    <Agentation endpoint="http://localhost:4747" />
  ) : null;
}

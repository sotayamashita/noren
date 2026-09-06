"use client";

import type { ComponentProps } from "react";
import { useRef } from "react";

import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

/** `<pre>` for MDX code blocks with a copy button; Typeset handles the rest. */
export function CodeBlock({
  children,
  className,
  ...props
}: ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);

  return (
    <pre className={cn("relative", className)} ref={ref} {...props}>
      {children}
      <CopyButton
        className="absolute end-1.5 top-1.5"
        getText={() => ref.current?.querySelector("code")?.textContent ?? ""}
      />
    </pre>
  );
}

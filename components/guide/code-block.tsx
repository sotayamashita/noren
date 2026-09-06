"use client";

import type { ComponentProps } from "react";
import { useRef } from "react";

import { CopyButton } from "@/components/guide/copy-button";
import { cn } from "@/lib/utils";

/** `<pre>` for MDX code blocks with a copy button; Typeset handles the rest. */
export function CodeBlock({
  children,
  className,
  ...props
}: ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);

  return (
    <pre
      className={cn(
        "flex items-center gap-2 [&>code]:min-w-0 [&>code]:flex-1 [&>code]:overflow-x-auto",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
      <CopyButton
        getText={() => ref.current?.querySelector("code")?.textContent ?? ""}
      />
    </pre>
  );
}

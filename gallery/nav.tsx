"use client";

import type { ReactNode } from "react";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

// Dev-only: labels are intentionally hardcoded.
const PAGES = [
  { href: "/dev/demo", label: "demo (motion)" },
  { href: "/dev/guide", label: "guide (MDX)" },
] as const;

export function DevNav(): ReactNode {
  const pathname = usePathname();
  return (
    <nav aria-label="Dev pages" className="flex gap-1 border-b">
      {PAGES.map((page) => {
        const active = pathname.startsWith(page.href);
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm",
              active
                ? "border-foreground font-medium"
                : "text-muted-foreground hover:text-foreground border-transparent"
            )}
            href={page.href}
            key={page.href}
          >
            {page.label}
          </Link>
        );
      })}
    </nav>
  );
}

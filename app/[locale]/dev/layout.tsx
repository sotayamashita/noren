import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { DevNav } from "@/gallery/nav";

/** Shared frame for the dev galleries: tab bar on top, 404 in production. */
export default function DevLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6">
      <DevNav />
      {children}
    </div>
  );
}

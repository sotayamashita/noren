"use client";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import { CopyButton } from "@/components/copy-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface InstallOption {
  id: string;
  label: string;
  command: string;
}

type InstallTab = { id: string; label: string } & (
  | { command: string }
  | {
      optionsLabel: string;
      options: readonly [InstallOption, ...InstallOption[]];
    }
);

export function InstallCommand({
  tabs,
}: {
  tabs: readonly [InstallTab, ...InstallTab[]];
}): ReactNode {
  const [activeId, setActiveId] = useState<string>();
  // Remembered per tab so switching tabs keeps each dropdown's choice.
  const [choices, setChoices] = useState<Partial<Record<string, string>>>({});

  const tab = tabs.find((item) => item.id === activeId) ?? tabs[0];
  const selection =
    "options" in tab
      ? (tab.options.find((item) => item.id === choices[tab.id]) ??
        tab.options[0])
      : tab;
  const { command } = selection;

  return (
    <figure>
      <div className="not-typeset bg-card overflow-hidden rounded-xl border text-base leading-normal shadow-xs">
        <div className="bg-muted/40 flex flex-wrap items-center gap-2 border-b px-2 py-2">
          {tabs.map((item) => (
            <button
              aria-pressed={item.id === tab.id}
              className={cn(
                "rounded-md px-3 py-1 font-mono text-xs whitespace-nowrap transition-colors",
                item.id === tab.id
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              key={item.id}
              onClick={() => setActiveId(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
          {"options" in tab && "label" in selection ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="ms-auto flex items-center gap-1 rounded-md px-2 py-1 text-xs whitespace-nowrap">
                <span className="text-muted-foreground">
                  {tab.optionsLabel}
                </span>
                <span className="font-medium">{selection.label}</span>
                <ChevronDownIcon className="text-muted-foreground size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-max whitespace-nowrap"
              >
                <DropdownMenuRadioGroup
                  onValueChange={(value) =>
                    setChoices((current) => ({
                      ...current,
                      [tab.id]: String(value),
                    }))
                  }
                  value={selection.id}
                >
                  {tab.options.map((item) => (
                    <DropdownMenuRadioItem key={item.id} value={item.id}>
                      {item.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
        <div className="flex items-start gap-3 px-4 py-3">
          <span aria-hidden className="text-muted-foreground select-none">
            $
          </span>
          {/* Wraps: prompts are sentences and JSON snippets are multi-line. */}
          <code className="min-w-0 flex-1 font-mono text-sm break-words whitespace-pre-wrap select-all">
            {command}
          </code>
          <CopyButton className="-my-1" getText={() => command} />
        </div>
      </div>
    </figure>
  );
}

"use client";

import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { CopyButton } from "@/components/copy-button";
import { Section } from "@/components/section";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { site } from "@/content/site";
import type { InstallTabId } from "@/content/site";
import { cn } from "@/lib/utils";

export function InstallCommand() {
  const t = useTranslations("install");
  const [activeId, setActiveId] = useState<InstallTabId>(site.install[0].id);
  // Remembered per tab so switching tabs keeps each dropdown's choice.
  const [choices, setChoices] = useState<Partial<Record<InstallTabId, string>>>(
    {}
  );

  const tab =
    site.install.find((item) => item.id === activeId) ?? site.install[0];
  const selection =
    "options" in tab
      ? (tab.options.find((item) => item.id === choices[tab.id]) ??
        tab.options[0])
      : tab;
  const { command } = selection;

  return (
    <Section>
      <div className="bg-card overflow-hidden rounded-xl border shadow-xs">
        <div className="bg-muted/40 flex flex-wrap items-center gap-2 border-b px-2 py-2">
          {site.install.map((item) => (
            <button
              aria-pressed={item.id === activeId}
              className={cn(
                "rounded-md px-3 py-1 font-mono text-xs whitespace-nowrap transition-colors",
                item.id === activeId
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              key={item.id}
              onClick={() => setActiveId(item.id)}
              type="button"
            >
              {t(`tabs.${item.id}`)}
            </button>
          ))}
          {"options" in tab && "label" in selection ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="ms-auto flex items-center gap-1 rounded-md px-2 py-1 text-xs whitespace-nowrap">
                <span className="text-muted-foreground">
                  {t(`optionLabels.${tab.id}`)}
                </span>
                <span className="font-medium">{selection.label}</span>
                <ChevronDownIcon className="text-muted-foreground size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
          <code className="flex-1 font-mono text-sm break-words whitespace-pre-wrap select-all">
            {command}
          </code>
          <CopyButton className="-my-1" getText={() => command} />
        </div>
      </div>
    </Section>
  );
}

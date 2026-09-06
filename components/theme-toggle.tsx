"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEMES = ["light", "dark", "system"] as const;

export function ThemeToggle() {
  const t = useTranslations("header.theme");
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button aria-label={t("label")} size="icon" variant="ghost" />}
      >
        {/* Both icons render; CSS shows the one matching the resolved theme, so there is no hydration flash. */}
        <SunIcon className="dark:hidden" />
        <MoonIcon className="hidden dark:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          onValueChange={(value) => setTheme(String(value))}
          value={theme ?? "system"}
        >
          {THEMES.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {option === "light" && <SunIcon />}
              {option === "dark" && <MoonIcon />}
              {option === "system" && <MonitorIcon />}
              {t(option)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

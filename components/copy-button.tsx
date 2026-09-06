"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const COPIED_RESET_MS = 1500;

interface CopyButtonProps {
  /** Read lazily so callers can pull the text out of the DOM. */
  getText: () => string;
  className?: string;
}

export function CopyButton({ getText, className }: CopyButtonProps) {
  const t = useTranslations("copy");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const id = window.setTimeout(() => setCopied(false), COPIED_RESET_MS);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
    } catch {
      // Clipboard can be unavailable (insecure context); the text stays selectable.
    }
  };

  return (
    <Button
      aria-label={copied ? t("done") : t("label")}
      className={className}
      onClick={copy}
      size="icon-sm"
      variant="ghost"
    >
      {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
    </Button>
  );
}

import { ArrowUpRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentProps, ReactNode } from "react";

import { Link as LocaleLink } from "@/lib/i18n/navigation";

const EXTERNAL_URL = /^https?:\/\//u;
/** Keeps the icon on the same line as the last word of the link. */
const NO_BREAK_SPACE = " ";

/**
 * The site's link. Pass the same props as `<a>`; the component decides the
 * rest from `href`. External URLs open in a new tab and carry an icon so they
 * read differently from internal links; paths keep the locale prefix; anchors
 * stay plain.
 *
 * The icon is sized to the text (1em box, glyph fills the middle 40%) and
 * stroked for medium text. Beside regular text, override with
 * `[&>svg]:stroke-[1.5]`. Pass `icon={false}` on icon-only controls, where
 * the arrow would compete with the control's own icon; the new-tab note for
 * screen readers stays.
 */
export function Link({
  href = "",
  icon = true,
  children,
  ...props
}: ComponentProps<"a"> & { icon?: boolean }): ReactNode {
  const t = useTranslations("link");

  if (EXTERNAL_URL.test(href)) {
    return (
      <a href={href} rel="noopener noreferrer" target="_blank" {...props}>
        {children}
        {icon ? (
          <>
            {NO_BREAK_SPACE}
            <ArrowUpRightIcon
              aria-hidden
              className="inline-block size-[1em] align-[-0.125em]"
              strokeWidth={2}
            />
          </>
        ) : null}
        <span className="sr-only">{t("newTab")}</span>
      </a>
    );
  }

  if (href.startsWith("/")) {
    return (
      <LocaleLink href={href} {...props}>
        {children}
      </LocaleLink>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

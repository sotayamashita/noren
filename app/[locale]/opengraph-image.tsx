import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { site } from "@/content/site";
import { routing } from "@/lib/i18n/routing";
import { loadGoogleFont } from "@/lib/og-font";

export const alt = site.name;
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function OpenGraphImage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("title");
  const description = t("description");
  const { host } = new URL(site.url);

  const family = locale === "ja" ? "Noto Sans JP" : "Geist";
  const font = await loadGoogleFont(family, `${title}${description}${host}`);

  return new ImageResponse(
    <div
      style={{
        background: "#ffffff",
        color: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        fontFamily: family,
        height: "100%",
        justifyContent: "space-between",
        padding: 72,
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          color: "#737373",
          display: "flex",
          fontSize: 28,
          gap: 16,
        }}
      >
        <div
          style={{
            background: "#0a0a0a",
            borderRadius: 9999,
            height: 20,
            width: 20,
          }}
        />
        {host}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: -3 }}>
          {title}
        </div>
        <div
          style={{
            color: "#525252",
            fontSize: 40,
            lineHeight: 1.3,
            maxWidth: 960,
          }}
        >
          {description}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: font
        ? [{ data: font, name: family, style: "normal", weight: 600 }]
        : undefined,
    }
  );
}

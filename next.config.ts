import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

// Plugins are passed by name so Turbopack can serialise the options.
const withMDX = createMDX({
  options: {
    rehypePlugins: [
      [
        "rehype-pretty-code",
        {
          defaultLang: "plaintext",
          keepBackground: false,
          theme: { dark: "github-dark", light: "github-light" },
        },
      ],
    ],
    // GFM adds tables, task lists, strikethrough and autolinks.
    remarkPlugins: ["remark-gfm"],
  },
});

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(withMDX(nextConfig));

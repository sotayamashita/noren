// Satori (next/og) needs TTF/OTF/WOFF, not WOFF2. Google Fonts serves TTF to
// user agents that predate WOFF2, so we ask with an old Safari UA and only for
// the glyphs we render. Returns null when offline so the image still builds.
const LEGACY_UA =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

// oxlint-disable-next-line prefer-named-capture-group -- Next's type-check targets ES2017, which rejects named groups.
const FONT_URL = /src: url\((.+?)\)/u;

export async function loadGoogleFont(
  family: string,
  text: string
): Promise<ArrayBuffer | null> {
  try {
    const css = new URL("https://fonts.googleapis.com/css2");
    css.searchParams.set("family", `${family}:wght@600`);
    css.searchParams.set("text", text);

    const stylesheet = await fetch(css, {
      headers: { "User-Agent": LEGACY_UA },
    });
    const url = FONT_URL.exec(await stylesheet.text())?.[1];
    if (!(stylesheet.ok && url)) {
      return null;
    }
    const font = await fetch(url);
    return font.ok ? await font.arrayBuffer() : null;
  } catch {
    return null;
  }
}

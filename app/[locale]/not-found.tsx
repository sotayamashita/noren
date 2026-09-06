import { useTranslations } from "next-intl";

import { Link } from "@/lib/i18n/navigation";

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col items-start gap-4 px-4 py-24">
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-muted-foreground">{t("body")}</p>
      <Link className="text-sm underline underline-offset-4" href="/">
        {t("home")}
      </Link>
    </section>
  );
}

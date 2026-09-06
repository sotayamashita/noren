import { useTranslations } from "next-intl";

import { Section } from "@/components/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];

  return (
    <Section title={t("heading")}>
      <Accordion>
        {items.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-pretty">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}

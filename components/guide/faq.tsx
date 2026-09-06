import type { ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq({ children }: { children: ReactNode }): ReactNode {
  return (
    <figure>
      <Accordion className="not-typeset text-base leading-normal">
        {children}
      </Accordion>
    </figure>
  );
}

export function FaqItem({
  question,
  children,
}: {
  question: string;
  children: ReactNode;
}): ReactNode {
  return (
    <AccordionItem value={question}>
      <AccordionTrigger>{question}</AccordionTrigger>
      <AccordionContent className="text-muted-foreground text-pretty">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

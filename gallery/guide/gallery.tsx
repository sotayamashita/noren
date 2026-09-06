import type { ReactNode } from "react";

import { Guide } from "@/components/guide/guide";

import { Group, Tile } from "../tile";
import GalleryContent from "./content.mdx";

export function GuideGallery({ children }: { children: ReactNode }): ReactNode {
  return (
    <div className="flex flex-col gap-12">
      <Group title="MDX under Typeset (gallery/guide/content.mdx)">
        <Tile name="guide / content">
          <Guide>
            <GalleryContent />
          </Guide>
        </Tile>
      </Group>
      <Group title="Published guide">
        <Tile name="guide / published content">
          <Guide>{children}</Guide>
        </Tile>
      </Group>
    </div>
  );
}

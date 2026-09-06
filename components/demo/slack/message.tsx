import type { SlackPost } from "@/lib/demo/scene";
import { cn } from "@/lib/utils";

/** Slack's link blue; lightened in dark mode so it stays readable on the dark highlight. */
const LINK = "text-(--slack-link)";

export function Avatar({
  kind,
  name,
}: {
  kind: SlackPost["role"];
  name: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-md text-sm font-semibold",
        kind === "agent"
          ? "bg-(--slack-tint) text-(--slack-link)"
          : "bg-muted text-muted-foreground"
      )}
    >
      {kind === "agent" ? "☺" : name.slice(0, 1)}
    </span>
  );
}

/** Blurred placeholder for older history above the real conversation. */
export function SkeletonMessage() {
  return (
    <div aria-hidden className="flex gap-3">
      <span className="bg-muted size-9 shrink-0 rounded-md" />
      <div className="flex flex-1 flex-col gap-2 pt-1">
        <span className="bg-muted h-2.5 w-24 rounded" />
        <span className="bg-muted h-2.5 w-full rounded" />
        <span className="bg-muted h-2.5 w-2/3 rounded" />
      </div>
    </div>
  );
}

interface MessageProps {
  post: SlackPost;
  agent: string;
  /** Number of thread replies; renders the "N replies" link when > 0. */
  replies: number;
}

export function Message({ post, agent, replies }: MessageProps) {
  return (
    <div className="flex gap-3">
      <Avatar kind={post.role} name={post.author} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="leading-snug">
          <span className="font-bold">{post.author}</span>{" "}
          <Mention mention={post.mention} text={post.text} />
        </div>
        {post.reactions?.length ? (
          <div className="flex gap-1">
            {post.reactions.map((reaction) => (
              <span
                className="bg-muted rounded-full border px-2 py-0.5 text-xs"
                key={reaction}
              >
                {reaction} 1
              </span>
            ))}
          </div>
        ) : null}
        {replies > 0 ? (
          <span
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold",
              LINK
            )}
            data-anchor={`${post.id}-replies`}
          >
            <span className="flex size-5 items-center justify-center rounded bg-(--slack-tint) text-[10px] text-(--slack-link)">
              ☺
            </span>
            {replies} {replies === 1 ? "reply" : "replies"}
            <span className="sr-only">from {agent}</span>
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** Highlights `mention` inside `text` the way Slack renders @user. */
export function Mention({ text, mention }: { text: string; mention?: string }) {
  if (!mention || !text.includes(mention)) {
    return text;
  }
  const [before, after] = text.split(mention, 2);
  return (
    <>
      {before}
      <span className={cn("rounded-sm bg-(--slack-tint) px-0.5", LINK)}>
        {mention}
      </span>
      {after}
    </>
  );
}

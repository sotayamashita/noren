import type { Scene } from "@/lib/demo/scene";

/**
 * A Slack conversation with an agent, modelled on the Agentforce demos:
 * a teammate @mentions the agent in a channel, the agent answers in a
 * thread with a document card and buttons, the user clicks one.
 *
 * Cursor targets: `${postId}-replies` for a message's reply link, and the
 * `id` of any attachment or action in a reply. See `demoScene` for the
 * general rules.
 */
export const slackScene: Scene = {
  duration: 11_000,
  layout: "slack",
  steps: [
    // Beat 1: the channel with some history, and a teammate starts typing.
    {
      agent: "Deal support agent",
      at: 0,
      history: 2,
      name: "deals-acme",
      type: "slack.channel",
    },
    { at: 600, text: "@Deal support agent", type: "slack.compose" },
    {
      at: 1200,
      text: "@Deal support agent ACME wants a 12-month term instead of 24. What should we do?",
      type: "slack.compose",
    },

    // Beat 2: the message is posted; the agent replies in a thread.
    {
      at: 2000,
      author: "Emily Nishino",
      id: "ask",
      mention: "@Deal support agent",
      role: "user",
      text: "@Deal support agent ACME wants a 12-month term instead of 24. What should we do?",
      type: "slack.post",
    },
    {
      actions: [
        { id: "yes", label: "Yes", primary: true },
        { id: "no", label: "No" },
      ],
      at: 3200,
      attachments: [
        { id: "legal", kind: "canvas", title: "Legal request draft" },
      ],
      id: "draft",
      text: "Hi! I drafted a legal request for ACME's 12-month terms. Want me to send it?",
      type: "slack.reply",
    },

    // Beat 3: the user opens the thread and confirms.
    { at: 3800, label: "1 reply", target: "ask-replies", type: "cursor" },
    { at: 4600, click: true, target: "ask-replies", type: "cursor" },
    { at: 4900, open: true, type: "slack.thread" },
    { at: 5600, label: "Yes", target: "yes", type: "cursor" },
    { at: 6400, click: true, target: "yes", type: "cursor" },

    // Beat 4: the agent follows through with more material.
    {
      at: 7200,
      attachments: [
        {
          id: "deck",
          kind: "slides",
          title: "Aqua Inc. (competitor) — latest",
        },
      ],
      id: "sent",
      text: "Sent to legal. I also attached the latest competitor deck for the call.",
      type: "slack.reply",
    },
    { at: 7600, target: null, type: "cursor" },
  ],
};

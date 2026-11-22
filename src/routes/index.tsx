import { createFileRoute } from "@tanstack/react-router";
import { Workbench } from "@/components/codex4/Workbench";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CODEX4 — Neon Portal workspace" },
      { name: "description", content: "CODEX4: your AI development workspace with the Neon Portal interface. Development by AMAR SALAMA." },
      { property: "og:title", content: "CODEX4 — Neon Portal workspace" },
      { property: "og:description", content: "Your AI development workspace. Turn ideas into extraordinary software." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Workbench,
});

import { ArrowRight, Code2, Box, GitBranch, Wrench } from "lucide-react";
import portal from "@/assets/neon-portal.jpg.asset.json";
import { cn } from "@/lib/utils";
import type { ViewId } from "./data";
import { AskCodex } from "./AskCodex";
import { C4Mark, Signature } from "./Logo";
import { toneText, useWorkbench } from "./store";

const cards: {
  title: string;
  text: string;
  icon: typeof Code2;
  tone: "neon" | "violet" | "cyan" | "gold";
  view: ViewId;
  prompt: string;
}[] = [
  { title: "Explore code", text: "Understand your project structure", icon: Code2, tone: "neon", view: "explorer", prompt: "Explain the structure of this project and where the main entry points are." },
  { title: "Build features", text: "Plan and create something new", icon: Box, tone: "violet", view: "home", prompt: "Plan and build a new feature: " },
  { title: "Review changes", text: "Review code and inspect changes", icon: GitBranch, tone: "cyan", view: "changes", prompt: "Review my uncommitted changes and point out problems." },
  { title: "Fix issues", text: "Find and resolve project errors", icon: Wrench, tone: "gold", view: "explorer", prompt: "Find the errors in this project and fix them." },
];

export function HomeView() {
  const wb = useWorkbench();
  return (
    <div className="view-enter mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 md:p-6">
      <section className="neon-frame relative overflow-hidden rounded-2xl bg-surface">
        <img
          src={portal.url}
          alt="Glowing neon portal ring inside a futuristic lab"
          className="absolute inset-0 size-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-[image:var(--gradient-hero-fade)]" />
        <div className="relative flex min-h-56 flex-col justify-center gap-3 p-6 md:min-h-72 md:p-10">
          <p className="neon-text font-mono text-xs uppercase tracking-[0.35em]">Neon Portal</p>
          <h1 className="max-w-md text-3xl font-semibold leading-tight md:text-5xl">What will we build today?</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            Your AI development workspace. Turn ideas into extraordinary software.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <button
            key={c.title}
            onClick={() => {
              wb.setAskDraft(c.prompt);
              if (c.view !== "home") wb.setView(c.view);
            }}
            className="surface-card group flex flex-col items-start gap-3 rounded-xl p-4 text-left"
          >
            <span className={cn("inline-flex size-10 items-center justify-center rounded-full border border-current/40", toneText[c.tone])}>
              <c.icon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">{c.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.text}</p>
            </div>
            <span className="ml-auto inline-flex size-6 items-center justify-center rounded-full border text-muted-foreground transition-colors group-hover:border-neon group-hover:text-neon">
              <ArrowRight className="size-3" />
            </span>
          </button>
        ))}
      </section>

      <AskCodex />

      <footer className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <C4Mark className="size-6 text-[10px]" />
          <span className="text-xs font-semibold tracking-[0.2em]">CODEX4</span>
        </div>
        <Signature />
      </footer>
    </div>
  );
}

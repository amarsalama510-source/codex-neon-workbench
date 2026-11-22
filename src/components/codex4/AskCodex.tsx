import { useEffect, useRef, useState } from "react";
import { ArrowUp, FolderOpen, Globe, Paperclip, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useWorkbench } from "./store";

export function AskCodex() {
  const wb = useWorkbench();
  const [sending, setSending] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (wb.askDraft) ref.current?.focus();
  }, [wb.askDraft]);

  const send = () => {
    const prompt = wb.askDraft.trim();
    if (!prompt || sending) return;
    setSending(true);
    window.setTimeout(() => {
      wb.addConversation(prompt);
      wb.setAskDraft("");
      setSending(false);
      toast("Prompt is ready in Chat", {
        description: "No AI model is connected yet — connect one in Settings to run it.",
        action: { label: "Open", onClick: () => wb.setView("conversations") },
      });
    }, 650);
  };

  return (
    <section className="rounded-xl border bg-card/80 p-3 transition-colors focus-within:border-neon/60 focus-within:shadow-[var(--glow-neon)]">
      <div className="flex items-center justify-between">
        <button
          onClick={() => wb.setView("projects")}
          className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <FolderOpen className="size-3.5" /> Codex4
        </button>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">Ask Codex</span>
      </div>
      <textarea
        ref={ref}
        value={wb.askDraft}
        onChange={(e) => wb.setAskDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        rows={2}
        placeholder="Ask Codex to build, explain, or fix something..."
        className="mt-1 w-full resize-none bg-transparent px-1.5 py-2 text-sm placeholder:text-muted-foreground/70 focus:outline-none"
      />
      <div className="flex items-center gap-1.5">
        {[
          { icon: Paperclip, label: "Attach file" },
          { icon: Globe, label: "Web search" },
          { icon: SlidersHorizontal, label: "Model options" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            aria-label={label}
            title={label}
            onClick={() => (label === "Model options" ? wb.setView("settings") : toast(label, { description: "Available once a model is connected." }))}
            className="inline-flex size-7 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-neon/60 hover:text-foreground"
          >
            <Icon className="size-3.5" />
          </button>
        ))}
        <p className="ml-2 hidden truncate text-[11px] text-muted-foreground sm:block">
          Agent mode · Your prompt will be ready in Chat
        </p>
        <button
          onClick={send}
          disabled={!wb.askDraft.trim() || sending}
          aria-label="Send"
          className="ml-auto inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:shadow-[var(--glow-neon)] disabled:opacity-40"
        >
          {sending ? <span className="portal-loader size-4" /> : <ArrowUp className="size-4" />}
        </button>
      </div>
    </section>
  );
}

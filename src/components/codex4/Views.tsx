import { toast } from "sonner";
import { MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { allNav, extensions, listViews, shortcuts, type ViewId } from "./data";
import { themeLabels } from "./TopBar";
import { toneBg, toneText, useWorkbench, type PeacockTone, type ThemeId } from "./store";

function ViewHeader({ view, title, subtitle }: { view: ViewId; title: string; subtitle: string }) {
  const nav = allNav.find((n) => n.view === view && n.id !== "new-task");
  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {nav && (
        <code className="rounded-md border bg-surface px-2 py-1 font-mono text-[10px] text-muted-foreground">
          {nav.command}
        </code>
      )}
    </header>
  );
}

export function ListView({ view }: { view: ViewId }) {
  const data = listViews[view];
  if (!data) return null;
  return (
    <div className="view-enter mx-auto w-full max-w-4xl p-4 md:p-6">
      <ViewHeader view={view} title={data.title} subtitle={data.subtitle} />
      <ul className="space-y-2">
        {data.rows.map((r) => (
          <li key={r.title}>
            <button
              onClick={() => toast(r.title, { description: r.detail })}
              className="surface-card flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left"
            >
              <span className={cn("size-2 shrink-0 rounded-full", r.tone && r.tone !== "muted" ? toneBg[r.tone] : "bg-muted-foreground")} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[13px]">{r.title}</p>
                <p className="truncate text-xs text-muted-foreground">{r.detail}</p>
              </div>
              {r.meta && <span className={cn("font-mono text-[11px]", toneText[r.tone ?? "muted"])}>{r.meta}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ConversationsView() {
  const wb = useWorkbench();
  return (
    <div className="view-enter mx-auto w-full max-w-4xl p-4 md:p-6">
      <ViewHeader view="conversations" title="Conversations" subtitle="Prompts you sent from Ask Codex." />
      {wb.conversations.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <MessageSquare className="mx-auto size-6 text-muted-foreground" />
          <p className="mt-3 text-sm">No conversations yet</p>
          <button onClick={() => wb.setView("home")} className="mt-3 text-xs text-neon hover:underline">
            Start a new task
          </button>
        </div>
      ) : (
        <ul className="space-y-2">
          {wb.conversations.map((c) => (
            <li key={c.id} className="surface-card rounded-lg px-4 py-3">
              <p className="text-sm">{c.prompt}</p>
              <p className="mt-1 font-mono text-[11px] text-gold">
                Waiting for an AI model · {new Date(c.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ExtensionsView() {
  const wb = useWorkbench();
  return (
    <div className="view-enter mx-auto w-full max-w-4xl p-4 md:p-6">
      <ViewHeader view="plugins" title="Plugins" subtitle="Extensions bundled with CODEX4. Turn one off to see its effect disappear." />
      <ul className="grid gap-3 md:grid-cols-2">
        {extensions.map((x) => {
          const on = wb.enabled[x.id];
          return (
            <li key={x.id} className={cn("surface-card flex gap-3 rounded-xl p-4", !on && "opacity-60")}>
              <span className={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-current/40 font-mono text-xs font-bold", toneText[x.tone])}>
                {x.short}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{x.name}</p>
                  <Switch checked={on} onCheckedChange={() => wb.toggleExtension(x.id)} aria-label={`Enable ${x.name}`} />
                </div>
                <p className="font-mono text-[10px] text-muted-foreground">{x.marketplaceId}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">{x.description}</p>
                <p className={cn("mt-1.5 text-[11px]", on ? "text-neon" : "text-muted-foreground")}>
                  {on ? "Enabled" : "Disabled"} · {x.effect}
                </p>
                {x.id === "peacock" && on && (
                  <div className="mt-2 flex gap-1.5">
                    {(["neon", "cyan", "violet", "gold"] as PeacockTone[]).map((t) => (
                      <button
                        key={t}
                        aria-label={`Peacock ${t}`}
                        onClick={() => wb.setPeacock(t)}
                        className={cn("size-5 rounded-full", toneBg[t], wb.peacock === t && "ring-2 ring-foreground ring-offset-2 ring-offset-card")}
                      />
                    ))}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SettingsView() {
  const wb = useWorkbench();
  return (
    <div className="view-enter mx-auto w-full max-w-3xl p-4 md:p-6">
      <ViewHeader view="settings" title="Settings" subtitle="Appearance, performance and AI." />
      <div className="space-y-3">
        <section className="surface-card rounded-xl p-4">
          <p className="text-sm font-semibold">Color theme</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {(Object.keys(themeLabels) as ThemeId[]).map((t) => (
              <button
                key={t}
                onClick={() => wb.setTheme(t)}
                data-active={wb.theme === t}
                className="nav-item rounded-lg border px-3 py-2 text-left text-xs hover:bg-accent"
              >
                {themeLabels[t]}
              </button>
            ))}
          </div>
        </section>
        <section className="surface-card flex items-center justify-between gap-4 rounded-xl p-4">
          <div>
            <p className="text-sm font-semibold">Performance mode</p>
            <p className="text-xs text-muted-foreground">Turns off glow, animations and transitions.</p>
          </div>
          <Switch checked={wb.reducedMotion} onCheckedChange={wb.setReducedMotion} aria-label="Performance mode" />
        </section>
        <section className="surface-card flex items-center justify-between gap-4 rounded-xl p-4">
          <div>
            <p className="text-sm font-semibold">AI model</p>
            <p className="text-xs text-muted-foreground">Ask Codex needs a connected model to answer.</p>
          </div>
          <span className="rounded-md border border-gold/50 px-2 py-1 font-mono text-[11px] text-gold">Not connected</span>
        </section>
      </div>
    </div>
  );
}

export function ShortcutsView() {
  return (
    <div className="view-enter mx-auto w-full max-w-3xl p-4 md:p-6">
      <ViewHeader view="shortcuts" title="Shortcuts" subtitle="Keyboard shortcuts in CODEX4." />
      <ul className="divide-y rounded-xl border bg-card">
        {shortcuts.map((s) => (
          <li key={s.keys} className="flex items-center justify-between px-4 py-2.5 text-sm">
            <span>{s.action}</span>
            <kbd className="rounded border bg-surface px-2 py-0.5 font-mono text-[11px] text-neon">{s.keys}</kbd>
          </li>
        ))}
      </ul>
    </div>
  );
}

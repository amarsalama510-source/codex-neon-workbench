import { GitBranch, XCircle, AlertTriangle } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { fileProblems } from "./data";
import { CommandPalette } from "./CommandPalette";
import { EditorView } from "./EditorView";
import { HomeView } from "./HomeView";
import { Signature } from "./Logo";
import { Sidebar, SidebarNav } from "./Sidebar";
import { themeLabels, TopBar } from "./TopBar";
import { ConversationsView, ExtensionsView, ListView, SettingsView, ShortcutsView } from "./Views";
import { useWorkbench, WorkbenchProvider } from "./store";

function MainArea() {
  const { view } = useWorkbench();
  switch (view) {
    case "home":
      return <HomeView />;
    case "explorer":
      return <EditorView />;
    case "plugins":
      return <ExtensionsView />;
    case "settings":
      return <SettingsView />;
    case "conversations":
      return <ConversationsView />;
    case "shortcuts":
      return <ShortcutsView />;
    default:
      return <ListView key={view} view={view} />;
  }
}

function StatusBar() {
  const wb = useWorkbench();
  const all = Object.values(fileProblems).flat();
  const errors = all.filter((p) => p.severity === "error").length;
  const warnings = all.length - errors;
  return (
    <footer className="flex h-7 shrink-0 items-center gap-4 border-t bg-surface px-3 font-mono text-[10.5px] text-muted-foreground">
      <button onClick={() => wb.setView("branches")} className="flex items-center gap-1 hover:text-foreground">
        <GitBranch className="size-3" /> main
      </button>
      {wb.enabled.eslint && (
        <button onClick={() => wb.setView("explorer")} className="flex items-center gap-2 hover:text-foreground">
          <span className="flex items-center gap-1"><XCircle className="size-3 text-destructive" />{errors}</span>
          <span className="flex items-center gap-1"><AlertTriangle className="size-3 text-gold" />{warnings}</span>
        </button>
      )}
      {wb.enabled.prettier && <span className="hidden sm:inline">Prettier ✓</span>}
      <span className="ml-auto hidden items-center gap-1.5 sm:flex">
        <span className="status-dot size-1.5 rounded-full" /> {themeLabels[wb.theme]}
      </span>
      <Signature className="hidden text-[10.5px] md:block" />
    </footer>
  );
}

function Shell() {
  const wb = useWorkbench();
  return (
    <div
      data-theme={wb.theme}
      data-motion={wb.reducedMotion ? "reduced" : "full"}
      className="flex h-dvh flex-col overflow-hidden bg-background text-foreground"
    >
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <Sidebar className="hidden md:block" />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <MainArea />
        </main>
      </div>
      <StatusBar />
      <Sheet open={wb.mobileNavOpen} onOpenChange={wb.setMobileNavOpen}>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetTitle className="sr-only">CODEX4 navigation</SheetTitle>
          <SidebarNav />
        </SheetContent>
      </Sheet>
      <CommandPalette />
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}

export function Workbench() {
  return (
    <WorkbenchProvider>
      <Shell />
    </WorkbenchProvider>
  );
}

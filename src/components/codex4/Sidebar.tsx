import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { footerNav, projectNav, selectProjectNav, workspaceNav, type NavItem } from "./data";
import { Signature } from "./Logo";
import { useWorkbench } from "./store";

function NavButton({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      data-active={active}
      title={item.command}
      className="nav-item flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-foreground"
    >
      <Icon className="size-4 shrink-0 opacity-80" />
      <span className="truncate">{item.label}</span>
    </button>
  );
}

export function SidebarNav() {
  const wb = useWorkbench();
  const isActive = (item: NavItem) =>
    item.id === "new-task" ? wb.view === "home" : wb.view === item.view;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <div className="flex items-center gap-2">
          <span className="neon-text text-base font-semibold">Codex</span>
          <span className="size-1.5 rounded-full bg-cyan" />
        </div>
        <button
          onClick={() => wb.setPaletteOpen(true)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Search"
        >
          <Search className="size-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2">
        <p className="px-2.5 pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Workspace</p>
        <div className="space-y-0.5">
          {workspaceNav.map((item) => (
            <NavButton key={item.id} item={item} active={isActive(item)} onClick={() => wb.setView(item.view)} />
          ))}
        </div>

        <p className="mt-5 px-2.5 pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Projects</p>
        <button
          onClick={() => wb.setView("projects")}
          data-active={wb.view === "projects"}
          className="nav-item mb-1 flex w-full items-center gap-2.5 rounded-md border border-neon/40 px-2.5 py-1.5 text-left text-[13px] hover:bg-sidebar-accent"
        >
          <selectProjectNav.icon className="size-4 text-neon" />
          <span className="flex-1 truncate">Codex4</span>
          {wb.view === "projects" ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        </button>
        <div className="space-y-0.5 pl-3">
          {projectNav.map((item) => (
            <NavButton key={item.id} item={item} active={isActive(item)} onClick={() => wb.setView(item.view)} />
          ))}
        </div>

        <div className="mt-5 space-y-0.5 border-t pt-3">
          {footerNav.map((item) => (
            <NavButton key={item.id} item={item} active={isActive(item)} onClick={() => wb.setView(item.view)} />
          ))}
        </div>
      </nav>

      <div className="border-t px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-md px-1.5 py-1">
          <span className="flex size-8 items-center justify-center rounded-full bg-neon/15 font-mono text-[11px] text-neon">AS</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px]">AMAR SALAMA</p>
            <p className="text-[11px] text-muted-foreground">Pro plan</p>
          </div>
        </div>
        <Signature className="mt-2 px-1.5" />
      </div>
    </div>
  );
}

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={cn("w-60 shrink-0 border-r bg-sidebar", className)}>
      <SidebarNav />
    </aside>
  );
}

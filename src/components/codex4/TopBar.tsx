import { Menu, Minus, Search, Square, X, Palette } from "lucide-react";
import { toast } from "sonner";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { C4Mark } from "./Logo";
import { toneBorder, useWorkbench, type ThemeId } from "./store";

export const themeLabels: Record<ThemeId, string> = {
  neon: "Neon Portal",
  midnight: "Midnight Cyan",
  aurora: "Aurora Violet",
};

type MenuEntry = { label: string; shortcut?: string; run: () => void } | "sep";

export function TopBar() {
  const wb = useWorkbench();
  const desktopOnly = (what: string) => () => toast(what, { description: "Runs natively in the CODEX4 desktop build." });

  const menus: Record<string, MenuEntry[]> = {
    File: [
      { label: "New Task", shortcut: "Ctrl+N", run: () => wb.setView("home") },
      { label: "Open Folder…", shortcut: "Ctrl+K O", run: () => wb.setView("projects") },
      { label: "Open File…", shortcut: "Ctrl+P", run: () => wb.setView("explorer") },
      "sep",
      { label: "Save", shortcut: "Ctrl+S", run: desktopOnly("Saved") },
      { label: "Settings", shortcut: "Ctrl+,", run: () => wb.setView("settings") },
      "sep",
      { label: "Exit", run: desktopOnly("Exit CODEX4") },
    ],
    Edit: [
      { label: "Undo", shortcut: "Ctrl+Z", run: desktopOnly("Undo") },
      { label: "Redo", shortcut: "Ctrl+Y", run: desktopOnly("Redo") },
      "sep",
      { label: "Find", shortcut: "Ctrl+F", run: () => wb.setPaletteOpen(true) },
      { label: "Replace", shortcut: "Ctrl+H", run: desktopOnly("Replace") },
    ],
    Selection: [
      { label: "Select All", shortcut: "Ctrl+A", run: desktopOnly("Select all") },
      { label: "Expand Selection", shortcut: "Shift+Alt+→", run: desktopOnly("Expand selection") },
      { label: "Add Cursor Below", shortcut: "Ctrl+Alt+↓", run: desktopOnly("Add cursor below") },
    ],
    View: [
      { label: "Command Palette…", shortcut: "Ctrl+Shift+P", run: () => wb.setPaletteOpen(true) },
      "sep",
      { label: "Explorer", shortcut: "Ctrl+Shift+E", run: () => wb.setView("explorer") },
      { label: "Extensions", shortcut: "Ctrl+Shift+X", run: () => wb.setView("plugins") },
      { label: "Source Control", shortcut: "Ctrl+Shift+G", run: () => wb.setView("changes") },
      { label: wb.terminalOpen ? "Hide Terminal" : "Show Terminal", shortcut: "Ctrl+`", run: () => { wb.setView("explorer"); wb.setTerminalOpen(!wb.terminalOpen); } },
      "sep",
      { label: wb.reducedMotion ? "Turn Effects On" : "Performance Mode (no effects)", run: () => wb.setReducedMotion(!wb.reducedMotion) },
    ],
    Go: [
      { label: "Home", run: () => wb.setView("home") },
      { label: "Go to File…", shortcut: "Ctrl+P", run: () => wb.setPaletteOpen(true) },
      { label: "Go to Branch…", run: () => wb.setView("branches") },
    ],
    Run: [
      { label: "Start Debugging", shortcut: "F5", run: desktopOnly("Debugger started") },
      { label: "Run Without Debugging", shortcut: "Ctrl+F5", run: desktopOnly("Running") },
      "sep",
      { label: "Run Task…", run: () => wb.setView("tasks") },
    ],
  };

  return (
    <header
      className={cn(
        "flex h-12 shrink-0 items-center gap-2 border-b bg-surface px-2 md:px-3",
        wb.enabled.peacock && cn("border-b-2", toneBorder[wb.peacock]),
      )}
    >
      <button
        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
        onClick={() => wb.setMobileNavOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </button>

      <button className="flex items-center gap-2 pr-2" onClick={() => wb.setView("home")} aria-label="CODEX4 home">
        <C4Mark />
        <span className="text-sm font-semibold tracking-[0.18em]">CODEX4</span>
      </button>

      <Menubar className="hidden h-8 border-none bg-transparent p-0 shadow-none lg:flex">
        {Object.entries(menus).map(([name, entries]) => (
          <MenubarMenu key={name}>
            <MenubarTrigger className="px-2.5 py-1 text-xs font-normal text-muted-foreground data-[state=open]:text-foreground">
              {name}
            </MenubarTrigger>
            <MenubarContent className="min-w-56">
              {entries.map((e, i) =>
                e === "sep" ? (
                  <MenubarSeparator key={i} />
                ) : (
                  <MenubarItem key={e.label} onSelect={e.run} className="text-xs">
                    {e.label}
                    {e.shortcut && <MenubarShortcut className="font-mono text-[10px]">{e.shortcut}</MenubarShortcut>}
                  </MenubarItem>
                ),
              )}
            </MenubarContent>
          </MenubarMenu>
        ))}
      </Menubar>

      <div className="flex flex-1 justify-center">
        <button
          onClick={() => wb.setPaletteOpen(true)}
          className="group flex h-8 w-full max-w-md items-center gap-2 rounded-lg border bg-background/60 px-3 text-xs text-muted-foreground transition-colors hover:border-neon/60 hover:text-foreground"
        >
          <Search className="size-3.5" />
          <span className="truncate">Search files, commands…</span>
          <kbd className="ml-auto hidden rounded border px-1.5 font-mono text-[10px] sm:inline">Ctrl K</kbd>
        </button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="hidden items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-neon/60 hover:text-foreground sm:flex">
          <span className="status-dot size-1.5 rounded-full" />
          <Palette className="size-3.5" />
          <span className="font-mono uppercase tracking-wider">{themeLabels[wb.theme]}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="text-xs">Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={wb.theme} onValueChange={(v) => wb.setTheme(v as ThemeId)}>
            {(Object.keys(themeLabels) as ThemeId[]).map((t) => (
              <DropdownMenuRadioItem key={t} value={t} className="text-xs">
                {themeLabels[t]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="hidden items-center md:flex">
        {[
          { icon: Minus, label: "Minimize" },
          { icon: Square, label: "Maximize" },
          { icon: X, label: "Close" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            aria-label={label}
            onClick={desktopOnly(label)}
            className={cn(
              "inline-flex h-8 w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              label === "Close" && "hover:bg-destructive hover:text-destructive-foreground",
            )}
          >
            <Icon className="size-3.5" />
          </button>
        ))}
      </div>
    </header>
  );
}

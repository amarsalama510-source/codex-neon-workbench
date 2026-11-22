import { useEffect } from "react";
import { toast } from "sonner";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/components/ui/command";
import { allNav, fileTree, type FileNode } from "./data";
import { themeLabels } from "./TopBar";
import { useWorkbench, type ThemeId } from "./store";

const flat = (nodes: FileNode[]): FileNode[] => nodes.flatMap((n) => (n.children ? flat(n.children) : [n]));

export function CommandPalette() {
  const wb = useWorkbench();
  const { setPaletteOpen, paletteOpen } = wb;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (k === "k" || k === "p")) {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  const run = (fn: () => void) => {
    setPaletteOpen(false);
    fn();
  };

  return (
    <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
      <CommandInput placeholder="Type a command or file name…" />
      <CommandList>
        <CommandEmpty>Nothing found.</CommandEmpty>
        <CommandGroup heading="Go to">
          {allNav.map((n) => (
            <CommandItem key={n.id} value={`${n.label} ${n.command}`} onSelect={() => run(() => wb.setView(n.view))}>
              <n.icon className="size-4" />
              {n.label}
              <CommandShortcut className="font-mono text-[10px] normal-case tracking-normal">{n.command}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Files">
          {flat(fileTree).map((f) => (
            <CommandItem key={f.path} value={f.path} onSelect={() => run(() => { wb.setOpenFile(f.path); wb.setView("explorer"); })}>
              {f.path}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Preferences">
          {(Object.keys(themeLabels) as ThemeId[]).map((t) => (
            <CommandItem key={t} value={`theme ${themeLabels[t]}`} onSelect={() => run(() => wb.setTheme(t))}>
              Color theme: {themeLabels[t]}
            </CommandItem>
          ))}
          <CommandItem value="performance mode effects" onSelect={() => run(() => wb.setReducedMotion(!wb.reducedMotion))}>
            {wb.reducedMotion ? "Turn effects on" : "Performance mode (turn effects off)"}
          </CommandItem>
          <CommandItem value="toggle terminal" onSelect={() => run(() => { wb.setView("explorer"); wb.setTerminalOpen(!wb.terminalOpen); })}>
            Toggle terminal
          </CommandItem>
          <CommandItem value="start debugging" onSelect={() => run(() => toast("Debugger started", { description: "Runs natively in the desktop build." }))}>
            Start debugging
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

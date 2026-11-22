import { useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight, FileCode2, FileJson, FileText, Folder, Paintbrush, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { fileContents, fileProblems, fileTree, type FileNode } from "./data";
import { useWorkbench } from "./store";

const KEYWORDS = /\b(import|from|export|const|let|function|async|await|return|if|else|new|true|false)\b/;
const indentTones = ["text-neon/50", "text-cyan/50", "text-violet/50", "text-gold/50"];
const indentBgs = ["bg-neon/10", "bg-cyan/10", "bg-violet/10", "bg-gold/10"];

function highlight(code: string): ReactNode[] {
  const parts = code.split(/('[^']*'|"[^"]*"|\/\/.*$|\b\d+\b|\b\w+\b)/g);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.startsWith("//")) return <span key={i} className="italic text-muted-foreground">{p}</span>;
    if (/^['"]/.test(p)) return <span key={i} className="text-neon">{p}</span>;
    if (/^\d+$/.test(p)) return <span key={i} className="text-gold">{p}</span>;
    if (KEYWORDS.test(p) && /^\w+$/.test(p)) return <span key={i} className="text-violet">{p}</span>;
    if (/^[A-Za-z_]\w*$/.test(p) && code.slice(code.indexOf(p) + p.length).startsWith("(")) return <span key={i} className="text-cyan">{p}</span>;
    return <span key={i}>{p}</span>;
  });
}

function fileIcon(name: string, colored: boolean) {
  if (name.endsWith(".json")) return <FileJson className={cn("size-3.5", colored ? "text-gold" : "text-muted-foreground")} />;
  if (name.endsWith(".ts")) return <FileCode2 className={cn("size-3.5", colored ? "text-cyan" : "text-muted-foreground")} />;
  if (name.endsWith(".css")) return <Paintbrush className={cn("size-3.5", colored ? "text-violet" : "text-muted-foreground")} />;
  return <FileText className={cn("size-3.5", colored ? "text-neon" : "text-muted-foreground")} />;
}

function Tree({ nodes, depth = 0 }: { nodes: FileNode[]; depth?: number }) {
  const wb = useWorkbench();
  const [open, setOpen] = useState<Record<string, boolean>>({ src: true, "src/workbench": true });
  return (
    <ul>
      {nodes.map((n) => (
        <li key={n.path}>
          <button
            onClick={() => (n.children ? setOpen((o) => ({ ...o, [n.path]: !o[n.path] })) : wb.setOpenFile(n.path))}
            data-active={wb.openFile === n.path}
            style={{ paddingLeft: 8 + depth * 12 }}
            className="nav-item flex w-full items-center gap-1.5 py-1 pr-2 text-left text-[12px] text-sidebar-foreground/80 hover:bg-sidebar-accent"
          >
            {n.children ? (
              <>
                {open[n.path] ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                <Folder className={cn("size-3.5", wb.enabled.material ? "text-gold" : "text-muted-foreground")} />
              </>
            ) : (
              <span className="ml-3">{fileIcon(n.name, wb.enabled.material)}</span>
            )}
            <span className="truncate">{n.name}</span>
          </button>
          {n.children && open[n.path] && <Tree nodes={n.children} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}

function Terminal() {
  const wb = useWorkbench();
  const [lines, setLines] = useState<string[]>(["CODEX4 terminal — type 'help'", ""]);
  const [cmd, setCmd] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  const run = (c: string) => {
    const responses: Record<string, string[]> = {
      help: ["Commands: node -v, pnpm -v, git status, clear, codex4"],
      "node -v": ["v24.22.1"],
      "pnpm -v": ["12.16.0"],
      "git status": ["On branch main", "modified: src/workbench/portal.ts", "modified: src/workbench/sidebar.ts"],
      codex4: ["CODEX4 1.148.0 — Development by AMAR SALAMA"],
    };
    if (c === "clear") return setLines([]);
    setLines((l) => [...l, `PS D:\\codex4\\Codex4> ${c}`, ...(responses[c] ?? [`'${c}' runs in the desktop build.`]), ""]);
    requestAnimationFrame(() => bottom.current?.scrollIntoView({ block: "end" }));
  };
  return (
    <div className="flex h-44 shrink-0 flex-col border-t bg-surface">
      <div className="flex items-center gap-4 border-b px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest">
        <span className="border-b border-neon pb-0.5 text-foreground">Terminal</span>
        <span className="text-muted-foreground">Problems</span>
        <span className="text-muted-foreground">Output</span>
        <button onClick={() => wb.setTerminalOpen(false)} className="ml-auto text-muted-foreground hover:text-foreground" aria-label="Close terminal">
          <X className="size-3.5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 font-mono text-[12px] leading-5">
        {lines.map((l, i) => (
          <div key={i} className={l.startsWith("PS ") ? "text-cyan" : "text-muted-foreground"}>{l || "\u00a0"}</div>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (cmd.trim()) run(cmd.trim());
            setCmd("");
          }}
          className="flex gap-2"
        >
          <span className="text-neon">PS&gt;</span>
          <input value={cmd} onChange={(e) => setCmd(e.target.value)} className="flex-1 bg-transparent focus:outline-none" aria-label="Terminal input" />
        </form>
        <div ref={bottom} />
      </div>
    </div>
  );
}

export function EditorView() {
  const wb = useWorkbench();
  const [tabs, setTabs] = useState<string[]>(["src/workbench/portal.ts", "product.json"]);
  const [cursor, setCursor] = useState(5);
  const file = wb.openFile;
  if (!tabs.includes(file)) setTabs((t) => [...t, file]);
  const lines = useMemo(() => (fileContents[file] ?? "").replace(/\n$/, "").split("\n"), [file]);
  const problems = fileProblems[file] ?? [];

  return (
    <div className="flex h-full min-h-0">
      <aside className="hidden w-56 shrink-0 overflow-y-auto border-r bg-sidebar md:block">
        <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Explorer · Codex4</p>
        <Tree nodes={fileTree} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center overflow-x-auto border-b bg-surface">
          {tabs.map((t) => (
            <div
              key={t}
              className={cn("flex shrink-0 items-center gap-1.5 border-r px-3 py-2 text-[12px]", t === file ? "border-t-2 border-t-neon bg-background text-foreground" : "text-muted-foreground")}
            >
              <button onClick={() => wb.setOpenFile(t)} className="flex items-center gap-1.5">
                {fileIcon(t, wb.enabled.material)}
                {t.split("/").pop()}
              </button>
              {tabs.length > 1 && (
                <button
                  aria-label={`Close ${t}`}
                  onClick={() => {
                    const next = tabs.filter((x) => x !== t);
                    setTabs(next);
                    if (t === file && next[0]) wb.setOpenFile(next[0]);
                  }}
                  className="opacity-60 hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          ))}
          {wb.enabled.prettier && (
            <button
              onClick={() => toast("Formatted with Prettier", { description: file })}
              className="ml-auto mr-2 shrink-0 rounded border px-2 py-0.5 font-mono text-[10px] text-muted-foreground hover:border-neon hover:text-neon"
            >
              Format
            </button>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-background py-2 font-mono text-[12.5px] leading-6">
          {lines.map((line, i) => {
            const n = i + 1;
            const indent = line.match(/^ */)?.[0].length ?? 0;
            const levels = Math.floor(indent / 2);
            const problem = problems.find((p) => p.line === n);
            return (
              <div
                key={i}
                onClick={() => setCursor(n)}
                className={cn(
                  "flex cursor-text whitespace-pre pr-4",
                  n === cursor && "bg-accent/40",
                  wb.enabled.errorlens && problem && (problem.severity === "error" ? "bg-destructive/10" : "bg-gold/10"),
                )}
              >
                <span className={cn("w-12 shrink-0 select-none pr-4 text-right", n === cursor ? "text-foreground" : "text-muted-foreground/50")}>{n}</span>
                <span>
                  {wb.enabled.indent
                    ? Array.from({ length: levels }, (_, l) => (
                        <span key={l} className={cn(indentBgs[l % 4], indentTones[l % 4])}>{"  "}</span>
                      ))
                    : " ".repeat(levels * 2)}
                  {highlight(line.slice(levels * 2))}
                </span>
                {wb.enabled.errorlens && problem && (
                  <span className={cn("ml-6 truncate italic", problem.severity === "error" ? "text-destructive" : "text-gold")}>
                    ● {problem.message}
                  </span>
                )}
                {wb.enabled.gitlens && n === cursor && !problem && (
                  <span className="ml-6 truncate text-muted-foreground/60">AMAR SALAMA, 2 days ago • feat: neon portal workbench</span>
                )}
              </div>
            );
          })}
        </div>
        {wb.terminalOpen && <Terminal />}
      </div>
    </div>
  );
}

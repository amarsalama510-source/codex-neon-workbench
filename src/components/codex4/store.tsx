import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ExtensionId, ViewId } from "./data";

export type ThemeId = "neon" | "midnight" | "aurora";
export type PeacockTone = "neon" | "cyan" | "violet" | "gold";
export type Conversation = { id: string; prompt: string; createdAt: number };

type State = {
  view: ViewId;
  theme: ThemeId;
  reducedMotion: boolean;
  enabled: Record<ExtensionId, boolean>;
  peacock: PeacockTone;
  conversations: Conversation[];
  askDraft: string;
  paletteOpen: boolean;
  mobileNavOpen: boolean;
  terminalOpen: boolean;
  openFile: string;
};

type Actions = {
  setView: (v: ViewId) => void;
  setTheme: (t: ThemeId) => void;
  setReducedMotion: (v: boolean) => void;
  toggleExtension: (id: ExtensionId) => void;
  setPeacock: (t: PeacockTone) => void;
  addConversation: (prompt: string) => void;
  setAskDraft: (v: string) => void;
  setPaletteOpen: (v: boolean) => void;
  setMobileNavOpen: (v: boolean) => void;
  setTerminalOpen: (v: boolean) => void;
  setOpenFile: (p: string) => void;
};

const defaultEnabled: Record<ExtensionId, boolean> = {
  gitlens: true,
  material: true,
  errorlens: true,
  prettier: true,
  eslint: true,
  peacock: true,
  indent: true,
};

const STORAGE_KEY = "codex4.workbench.v1";

const Ctx = createContext<(State & Actions) | null>(null);

export function WorkbenchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({
    view: "home",
    theme: "neon",
    reducedMotion: false,
    enabled: defaultEnabled,
    peacock: "neon",
    conversations: [],
    askDraft: "",
    paletteOpen: false,
    mobileNavOpen: false,
    terminalOpen: true,
    openFile: "src/workbench/portal.ts",
  });
  const [loaded, setLoaded] = useState(false);

  // Restore saved preferences after hydration.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<State>;
        setState((s) => ({
          ...s,
          theme: saved.theme ?? s.theme,
          reducedMotion: saved.reducedMotion ?? s.reducedMotion,
          enabled: { ...s.enabled, ...(saved.enabled ?? {}) },
          peacock: saved.peacock ?? s.peacock,
          conversations: saved.conversations ?? s.conversations,
        }));
      }
    } catch {
      // ignore broken storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const { theme, reducedMotion, enabled, peacock, conversations } = state;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ theme, reducedMotion, enabled, peacock, conversations }),
    );
  }, [loaded, state]);

  const patch = useCallback((p: Partial<State>) => setState((s) => ({ ...s, ...p })), []);

  const actions = useMemo<Actions>(
    () => ({
      setView: (view) => patch({ view, mobileNavOpen: false }),
      setTheme: (theme) => patch({ theme }),
      setReducedMotion: (reducedMotion) => patch({ reducedMotion }),
      toggleExtension: (id) => setState((s) => ({ ...s, enabled: { ...s.enabled, [id]: !s.enabled[id] } })),
      setPeacock: (peacock) => patch({ peacock }),
      addConversation: (prompt) =>
        setState((s) => ({
          ...s,
          conversations: [{ id: crypto.randomUUID(), prompt, createdAt: Date.now() }, ...s.conversations].slice(0, 30),
        })),
      setAskDraft: (askDraft) => patch({ askDraft }),
      setPaletteOpen: (paletteOpen) => patch({ paletteOpen }),
      setMobileNavOpen: (mobileNavOpen) => patch({ mobileNavOpen }),
      setTerminalOpen: (terminalOpen) => patch({ terminalOpen }),
      setOpenFile: (openFile) => patch({ openFile }),
    }),
    [patch],
  );

  return <Ctx.Provider value={{ ...state, ...actions }}>{children}</Ctx.Provider>;
}

export function useWorkbench() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWorkbench must be used inside WorkbenchProvider");
  return ctx;
}

export const toneText: Record<PeacockTone | "muted", string> = {
  neon: "text-neon",
  cyan: "text-cyan",
  violet: "text-violet",
  gold: "text-gold",
  muted: "text-muted-foreground",
};

export const toneBorder: Record<PeacockTone, string> = {
  neon: "border-neon",
  cyan: "border-cyan",
  violet: "border-violet",
  gold: "border-gold",
};

export const toneBg: Record<PeacockTone, string> = {
  neon: "bg-neon",
  cyan: "bg-cyan",
  violet: "bg-violet",
  gold: "bg-gold",
};

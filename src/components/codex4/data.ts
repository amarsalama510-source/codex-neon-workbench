import type { LucideIcon } from "lucide-react";
import {
  SquarePen,
  ListChecks,
  MessageSquare,
  Blocks,
  BookOpen,
  Settings,
  FolderOpen,
  Folder,
  History,
  GitBranch,
  GitPullRequest,
  Rocket,
  FileText,
  Keyboard,
} from "lucide-react";

export type ViewId =
  | "home"
  | "tasks"
  | "conversations"
  | "plugins"
  | "knowledge"
  | "settings"
  | "projects"
  | "explorer"
  | "changes"
  | "branches"
  | "pulls"
  | "deployments"
  | "docs"
  | "shortcuts";

export type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  view: ViewId;
  /** The VS Code / CODEX4 command this item maps to in the desktop build. */
  command: string;
};

export const workspaceNav: NavItem[] = [
  { id: "new-task", label: "New task", icon: SquarePen, view: "home", command: "workbench.action.chat.newChat" },
  { id: "tasks", label: "Tasks", icon: ListChecks, view: "tasks", command: "workbench.action.tasks.runTask" },
  { id: "conversations", label: "Conversations", icon: MessageSquare, view: "conversations", command: "workbench.action.chat.history" },
  { id: "plugins", label: "Plugins", icon: Blocks, view: "plugins", command: "workbench.view.extensions" },
  { id: "knowledge", label: "Knowledge", icon: BookOpen, view: "knowledge", command: "codex4.knowledge.open" },
  { id: "settings", label: "Settings", icon: Settings, view: "settings", command: "workbench.action.openSettings" },
];

export const projectNav: NavItem[] = [
  { id: "explorer", label: "Explorer", icon: Folder, view: "explorer", command: "workbench.view.explorer" },
  { id: "changes", label: "Recent changes", icon: History, view: "changes", command: "workbench.view.scm" },
  { id: "branches", label: "Branches", icon: GitBranch, view: "branches", command: "git.checkout" },
  { id: "pulls", label: "Pull requests", icon: GitPullRequest, view: "pulls", command: "codex4.pullRequests.open" },
  { id: "deployments", label: "Deployments", icon: Rocket, view: "deployments", command: "codex4.deployments.open" },
];

export const selectProjectNav: NavItem = {
  id: "projects",
  label: "Select project",
  icon: FolderOpen,
  view: "projects",
  command: "workbench.action.files.openFolder",
};

export const footerNav: NavItem[] = [
  { id: "docs", label: "Documentation", icon: FileText, view: "docs", command: "workbench.action.openDocumentationUrl" },
  { id: "shortcuts", label: "Shortcuts", icon: Keyboard, view: "shortcuts", command: "workbench.action.openGlobalKeybindings" },
];

export const allNav: NavItem[] = [...workspaceNav, selectProjectNav, ...projectNav, ...footerNav];

export type ListRow = { title: string; detail: string; meta?: string; tone?: "neon" | "cyan" | "violet" | "gold" | "muted" };

export const listViews: Partial<Record<ViewId, { title: string; subtitle: string; rows: ListRow[] }>> = {
  tasks: {
    title: "Tasks",
    subtitle: "Build and run tasks for the current project.",
    rows: [
      { title: "watch", detail: "Incremental compile of the workbench", meta: "running", tone: "neon" },
      { title: "vscode-win32-x64", detail: "Package CODEX4 for Windows x64", meta: "gulp", tone: "cyan" },
      { title: "vscode-win32-x64-user-setup", detail: "Build the CODEX4Setup installer", meta: "gulp", tone: "cyan" },
      { title: "test-unit", detail: "Run unit tests", meta: "idle", tone: "muted" },
    ],
  },
  knowledge: {
    title: "Knowledge",
    subtitle: "Project notes the assistant can read.",
    rows: [
      { title: "Neon Portal design spec", detail: "Top bar, sidebar, hero, cards and Ask Codex", meta: "spec", tone: "neon" },
      { title: "Build & packaging notes", detail: "pnpm 12.16.0 · Node v24.22.1 · gulp tasks", meta: "notes", tone: "cyan" },
      { title: "Performance log", detail: "Unresponsive window recovery after ~18.5s", meta: "issue", tone: "gold" },
    ],
  },
  projects: {
    title: "Select project",
    subtitle: "Open a recent folder or browse for a new one.",
    rows: [
      { title: "Codex4", detail: "D:\\codex4\\Codex4", meta: "current", tone: "neon" },
      { title: "VSCode-win32-x64", detail: "D:\\codex4\\VSCode-win32-x64", meta: "build", tone: "cyan" },
      { title: "portfolio-site", detail: "D:\\projects\\portfolio-site", meta: "2d ago", tone: "muted" },
    ],
  },
  changes: {
    title: "Recent changes",
    subtitle: "Modified files waiting to be committed.",
    rows: [
      { title: "src/workbench/portal.ts", detail: "Hero, cards and Ask Codex wiring", meta: "+128 −14", tone: "neon" },
      { title: "src/workbench/sidebar.ts", detail: "CODEX4 sidebar replaces the activity bar", meta: "+96 −40", tone: "neon" },
      { title: "product.json", detail: "nameShort / nameLong → CODEX4", meta: "+6 −6", tone: "gold" },
      { title: "resources/win32/code.ico", detail: "C4 Windows icon", meta: "binary", tone: "muted" },
    ],
  },
  branches: {
    title: "Branches",
    subtitle: "Switch or create a branch.",
    rows: [
      { title: "main", detail: "Current branch · 3 changes", meta: "HEAD", tone: "neon" },
      { title: "feature/neon-portal-workbench", detail: "Workbench redesign", meta: "2 ahead", tone: "cyan" },
      { title: "fix/layout-overflow", detail: "Window sizing fixes", meta: "1 behind", tone: "gold" },
    ],
  },
  pulls: {
    title: "Pull requests",
    subtitle: "Reviews waiting on you.",
    rows: [
      { title: "#14 Neon Portal workbench", detail: "feature/neon-portal-workbench → main", meta: "review", tone: "violet" },
      { title: "#13 Fix window overflow", detail: "fix/layout-overflow → main", meta: "draft", tone: "muted" },
    ],
  },
  deployments: {
    title: "Deployments",
    subtitle: "Packaged builds and installers.",
    rows: [
      { title: "Codex4.exe · win32-x64", detail: "1.148.0 · 1457.98 MB · 2780 files", meta: "built", tone: "neon" },
      { title: "CODEX4Setup.exe", detail: "Inno Setup installer", meta: "pending", tone: "gold" },
    ],
  },
  docs: {
    title: "Documentation",
    subtitle: "Guides for working in CODEX4.",
    rows: [
      { title: "Getting started", detail: "Open a project and run your first task", tone: "neon" },
      { title: "Using Ask Codex", detail: "Agent mode, prompts and models", tone: "cyan" },
      { title: "Extensions", detail: "Bundled extensions and how to manage them", tone: "violet" },
    ],
  },
};

export type ExtensionId = "gitlens" | "material" | "errorlens" | "prettier" | "eslint" | "peacock" | "indent";

export type Extension = {
  id: ExtensionId;
  name: string;
  marketplaceId: string;
  publisher: string;
  description: string;
  effect: string;
  tone: "neon" | "cyan" | "violet" | "gold";
  short: string;
};

export const extensions: Extension[] = [
  { id: "gitlens", name: "GitLens", marketplaceId: "eamodio.gitlens", publisher: "GitKraken", description: "Git supercharged — blame, history and authorship inline.", effect: "Shows who changed the current line in the editor.", tone: "cyan", short: "GL" },
  { id: "material", name: "Material Icon Theme", marketplaceId: "pkief.material-icon-theme", publisher: "Philipp Kief", description: "Material Design icons for files and folders.", effect: "Colored file icons in the Explorer.", tone: "gold", short: "MI" },
  { id: "errorlens", name: "Error Lens", marketplaceId: "usernamehw.errorlens", publisher: "Alexander", description: "Highlights errors and warnings right on the line.", effect: "Inline problem messages in the editor.", tone: "violet", short: "EL" },
  { id: "prettier", name: "Prettier", marketplaceId: "esbenp.prettier-vscode", publisher: "Prettier", description: "Opinionated code formatter.", effect: "Enables Format Document in the editor.", tone: "neon", short: "PR" },
  { id: "eslint", name: "ESLint", marketplaceId: "dbaeumer.vscode-eslint", publisher: "Microsoft", description: "Integrates ESLint into the editor.", effect: "Counts problems in the status bar.", tone: "violet", short: "ES" },
  { id: "peacock", name: "Peacock", marketplaceId: "johnpapa.vscode-peacock", publisher: "John Papa", description: "Subtly change the color of your workspace.", effect: "Tints the top bar with a workspace color.", tone: "cyan", short: "PK" },
  { id: "indent", name: "Indent Rainbow", marketplaceId: "oderwat.indent-rainbow", publisher: "oderwat", description: "Makes indentation easier to read.", effect: "Colors each indentation level.", tone: "gold", short: "IR" },
];

export const shortcuts: { keys: string; action: string }[] = [
  { keys: "Ctrl+Shift+P", action: "Command palette" },
  { keys: "Ctrl+K", action: "Search files and commands" },
  { keys: "Ctrl+P", action: "Go to file" },
  { keys: "Ctrl+B", action: "Toggle sidebar" },
  { keys: "Ctrl+`", action: "Toggle terminal" },
  { keys: "Shift+Alt+F", action: "Format document" },
  { keys: "F5", action: "Start debugging" },
  { keys: "Ctrl+Shift+X", action: "Extensions" },
];

export type FileNode = { name: string; path: string; children?: FileNode[] };

export const fileTree: FileNode[] = [
  {
    name: "src",
    path: "src",
    children: [
      {
        name: "workbench",
        path: "src/workbench",
        children: [
          { name: "portal.ts", path: "src/workbench/portal.ts" },
          { name: "sidebar.ts", path: "src/workbench/sidebar.ts" },
          { name: "portal.css", path: "src/workbench/portal.css" },
        ],
      },
      { name: "main.ts", path: "src/main.ts" },
    ],
  },
  { name: "product.json", path: "product.json" },
  { name: "package.json", path: "package.json" },
  { name: "README.md", path: "README.md" },
];

export const fileContents: Record<string, string> = {
  "src/workbench/portal.ts": `import { registerView } from './views';
import { openChat } from './chat';

// NEON PORTAL — CODEX4 home view
export const portalCards = [
  { id: 'explore', title: 'Explore code', command: 'workbench.view.explorer' },
  { id: 'build', title: 'Build features', command: 'workbench.action.chat.open' },
  { id: 'review', title: 'Review changes', command: 'workbench.view.scm' },
  { id: 'fix', title: 'Fix issues', command: 'workbench.actions.view.problems' },
];

export function askCodex(prompt: string) {
  if (!prompt.trim()) {
    return;
  }
  const model = getActiveModel();
  if (!model) {
    showNotice('Connect an AI model to run this prompt');
  }
  openChat({ mode: 'agent', prompt });
}

registerView('codex4.portal', portalCards, 1148);
`,
  "src/workbench/sidebar.ts": `export const sidebarGroups = {
  workspace: ['New task', 'Tasks', 'Conversations', 'Plugins', 'Knowledge', 'Settings'],
  projects: ['Explorer', 'Recent changes', 'Branches', 'Pull requests', 'Deployments'],
  footer: ['Documentation', 'Shortcuts'],
};

export function mountSidebar(layout) {
  layout.hide('workbench.parts.activitybar');
  layout.show('codex4.parts.sidebar', { width: 240 });
}
`,
  "src/workbench/portal.css": `.codex4-portal {
  display: grid;
  gap: 16px;
  overflow: hidden;
}

.codex4-portal .card:hover {
  box-shadow: 0 0 18px var(--codex4-neon);
}
`,
  "src/main.ts": `import { mountSidebar } from './workbench/sidebar';

async function start() {
  const layout = await createWorkbench();
  mountSidebar(layout);
  console.log('CODEX4 ready');
}

start();
`,
  "product.json": `{
  "nameShort": "CODEX4",
  "nameLong": "CODEX4",
  "applicationName": "codex4",
  "win32AppUserModelId": "AMARSALAMA.CODEX4",
  "dataFolderName": ".codex4"
}
`,
  "package.json": `{
  "name": "codex4",
  "version": "1.148.0",
  "packageManager": "pnpm@12.16.0"
}
`,
  "README.md": `# CODEX4

Your AI development workspace.

Development by AMAR SALAMA
`,
};

/** Line (1-based) and message used by the inline problem demo for each file. */
export const fileProblems: Record<string, { line: number; message: string; severity: "error" | "warning" }[]> = {
  "src/workbench/portal.ts": [
    { line: 18, message: "Cannot find name 'getActiveModel'.", severity: "error" },
    { line: 20, message: "Cannot find name 'showNotice'.", severity: "error" },
  ],
  "src/workbench/sidebar.ts": [{ line: 7, message: "Parameter 'layout' implicitly has an 'any' type.", severity: "warning" }],
  "src/main.ts": [{ line: 4, message: "Cannot find name 'createWorkbench'.", severity: "error" }],
};

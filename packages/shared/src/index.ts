export type Locale = "bn" | "en";

export type WorkspacePage = {
  id: string;
  workspace_id: string;
  parent_id: string | null;
  title: string;
  icon: string | null;
  content: unknown;
  created_at: string;
  updated_at: string;
};

export const messages = {
  en: {
    appName: "Nexus Workspace",
    home: "Home",
    search: "Search",
    pages: "Pages",
    tasks: "Tasks",
    calendar: "Calendar",
    settings: "Settings",
    welcome: "Your ideas, organized.",
    newPage: "New page",
    untitled: "Untitled",
    editorHint: "Start writing your ideas here…",
    language: "Language",
  },
  bn: {
    appName: "নেক্সাস ওয়ার্কস্পেস",
    home: "হোম",
    search: "খুঁজুন",
    pages: "পেজসমূহ",
    tasks: "কাজ",
    calendar: "ক্যালেন্ডার",
    settings: "সেটিংস",
    welcome: "আপনার ভাবনা, গুছানো এক জায়গায়।",
    newPage: "নতুন পেজ",
    untitled: "শিরোনামহীন",
    editorHint: "এখানে আপনার ভাবনা লিখুন…",
    language: "ভাষা",
  },
} as const;

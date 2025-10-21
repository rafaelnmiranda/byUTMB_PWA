"use client";

import { useLanguage } from "../hooks/useLanguage";

const LANGS: { code: "pt" | "en" | "es"; label: string }[] = [
  { code: "pt", label: "PT" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

const LangSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <nav
      aria-label="Select language"
      className="flex items-center gap-1 rounded-full border border-subtle bg-surface-alt p-1 backdrop-blur-sm"
    >
      {LANGS.map((entry) => {
        const isActive = entry.code === language;
        return (
          <button
            key={entry.code}
            type="button"
            onClick={() => setLanguage(entry.code)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              isActive
                ? "bg-brand-teal text-inverse"
                : "text-muted hover:text-primary"
            }`}
          >
            {entry.label}
          </button>
        );
      })}
    </nav>
  );
};

export default LangSwitcher;

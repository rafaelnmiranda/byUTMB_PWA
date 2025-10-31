"use client";

import { type JSX, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";

type ThemeOption = {
  value: "system" | "light" | "dark";
  label: string;
  icon: JSX.Element;
  description: string;
};

type LangOption = {
  code: "pt" | "en" | "es";
  label: string;
  flag: string;
};

const themeOptions: ThemeOption[] = [
  {
    value: "system",
    label: "Automático",
    description: "Segue o sistema",
    icon: (
      <path
        d="M12 3v3M12 18v3M4.7 6.3l2.1 2.1M17.2 17.2l2.1 2.1M3 12h3M18 12h3M4.7 17.2l2.1-2.1M17.2 6.3l2.1-2.1"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    ),
  },
  {
    value: "light",
    label: "Claro",
    description: "Tema claro",
    icon: (
      <path
        d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0-4.5v2M12 19v2M4.6 6.1l1.4 1.4M17.9 19.4l1.4 1.4M3 12h2m14 0h2M4.6 19.4l1.4-1.4M17.9 6.1l1.4-1.4"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    ),
  },
  {
    value: "dark",
    label: "Escuro",
    description: "Tema escuro",
    icon: (
      <path
        d="M20 12.7A8.3 8.3 0 0 1 11.3 4c0-.5 0-1 .1-1.5a.4.4 0 0 0-.6-.4 9.5 9.5 0 1 0 11 11 .4.4 0 0 0-.4-.6c-.5.1-1 .1-1.4.2Z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
];

const langOptions: LangOption[] = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

const SettingsMenu = () => {
  const { mode, resolved, setMode } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-subtle bg-gray-200 dark:bg-slate-900 px-3 py-2 text-sm font-medium transition-all hover:bg-gray-300 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 text-gray-900 dark:text-white"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Configurações"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="stroke-gray-900 dark:stroke-white">
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth={1.6} />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth={1.6} />
        </svg>
        <span className="hidden sm:inline text-gray-900 dark:text-white">Configurações</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          className={`transition-transform stroke-gray-900 dark:stroke-white ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-subtle bg-white dark:bg-slate-900 p-4 shadow-lg">
            {/* Tema */}
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Tema</h3>
              <div className="space-y-1">
                {themeOptions.map((option) => {
                  const isActive = option.value === mode;
                  const indicatesSystem = mode === "system" && option.value === resolved;

                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setMode(option.value);
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-white"
                          : "text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="relative flex h-4 w-4 items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="stroke-current">
                          {option.icon}
                        </svg>
                        {indicatesSystem && (
                          <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-brand-yellow" />
                        )}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">{option.description}</div>
                      </div>
                      {isActive && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-blue-600 dark:text-white">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Idioma */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Idioma</h3>
              <div className="space-y-1">
                {langOptions.map((lang) => {
                  const isActive = lang.code === language;

                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-white"
                          : "text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <div className="flex-1">
                        <div className="font-medium">{lang.label}</div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">{lang.code.toUpperCase()}</div>
                      </div>
                      {isActive && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-blue-600 dark:text-white">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsMenu;

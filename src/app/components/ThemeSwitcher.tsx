"use client";

import { type JSX } from "react";
import { useTheme } from "../hooks/useTheme";

type Option = {
  value: "system" | "light" | "dark";
  label: string;
  icon: JSX.Element;
};

const options: Option[] = [
  {
    value: "system",
    label: "Auto",
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

const ThemeSwitcher = () => {
  const { mode, resolved, setMode } = useTheme();

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-subtle bg-surface-alt p-1 backdrop-blur-sm"
      role="group"
      aria-label="Alternar tema"
    >
      {options.map((option) => {
        const isActive = option.value === mode;
        const indicatesSystem =
          mode === "system" && option.value === resolved;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setMode(option.value)}
            aria-pressed={isActive}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              isActive ? "bg-brand-teal text-inverse" : "text-muted hover:text-primary"
            }`}
          >
            <span className="relative flex h-4 w-4 items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="stroke-current"
              >
                {option.icon}
              </svg>
              {indicatesSystem && (
                <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-brand-yellow" />
              )}
            </span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;

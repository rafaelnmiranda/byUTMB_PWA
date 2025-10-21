"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const storageKey = "byutmb-theme-mode";

const isThemeMode = (value: unknown): value is ThemeMode =>
  value === "light" || value === "dark" || value === "system";

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(storageKey);
    if (isThemeMode(stored)) {
      setModeState(stored);
    } else {
      setModeState("system");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (targetTheme: ResolvedTheme) => {
      document.documentElement.dataset.theme = targetTheme;
      setResolved(targetTheme);
    };

    const handleSystemPreference = (event: MediaQueryListEvent) => {
      applyTheme(event.matches ? "dark" : "light");
    };

    if (mode === "system") {
      applyTheme(getSystemTheme());
      mediaQuery.addEventListener("change", handleSystemPreference);
      return () => {
        mediaQuery.removeEventListener("change", handleSystemPreference);
      };
    }

    applyTheme(mode);
    return undefined;
  }, [mode]);

  const setMode = useCallback((value: ThemeMode) => {
    setModeState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, value);
    }
  }, []);

  const value = useMemo(
    () => ({
      mode,
      resolved,
      setMode,
    }),
    [mode, resolved, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

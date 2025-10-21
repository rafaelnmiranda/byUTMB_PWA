"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translations, type Language, type TranslationKey } from "../assets/i18n";

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

const fallbackLanguage: Language = "pt";

const resolveTranslation = (key: TranslationKey, lang: Language) => {
  const segments = key.split(".");
  let pointer: unknown = translations;

  for (const segment of segments) {
    if (
      typeof pointer === "object" &&
      pointer !== null &&
      segment in (pointer as Record<string, unknown>)
    ) {
      pointer = (pointer as Record<string, unknown>)[segment];
    } else {
      pointer = undefined;
      break;
    }
  }

  if (
    pointer &&
    typeof pointer === "object" &&
    lang in (pointer as Record<string, string>)
  ) {
    return (pointer as Record<string, string>)[lang];
  }

  if (
    pointer &&
    typeof pointer === "object" &&
    fallbackLanguage in (pointer as Record<string, string>)
  ) {
    return (pointer as Record<string, string>)[fallbackLanguage];
  }

  return key;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(fallbackLanguage);

  const translate = useCallback(
    (key: TranslationKey) => resolveTranslation(key, language),
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translate,
    }),
    [language, translate],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const useTranslate = () => {
  const { t } = useLanguage();
  return t;
};

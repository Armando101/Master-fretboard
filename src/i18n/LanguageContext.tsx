"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  translations,
  LANG_COOKIE_NAME,
  DEFAULT_LOCALE,
  type Locale,
  type Translations,
} from "./index";

// ── Context shape ─────────────────────────────────────────────────────────────

interface LanguageContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

interface LanguageProviderProps {
  initialLocale?: Locale;
  children: ReactNode;
}

export function LanguageProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    // Persist in cookie (1 year, SameSite=Lax)
    document.cookie = `${LANG_COOKIE_NAME}=${newLocale}; max-age=31536000; path=/; SameSite=Lax`;
  }, []);

  return (
    <LanguageContext.Provider
      value={{ locale, t: translations[locale], setLocale }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return ctx;
}

import es from "./locales/es";
import en from "./locales/en";
import type { Translations } from "./locales/es";

export type Locale = "es" | "en";

export const SUPPORTED_LOCALES: Locale[] = ["es", "en"];
export const DEFAULT_LOCALE: Locale = "es";
export const LANG_COOKIE_NAME = "MASTER_FRETBOARD_LANG";

export const translations: Record<Locale, Translations> = { es, en };

export type { Translations };

/** Resolve a raw cookie string to a valid Locale (fallback to default). */
export function resolveLocale(raw: string | undefined): Locale {
  if (raw && SUPPORTED_LOCALES.includes(raw as Locale)) {
    return raw as Locale;
  }
  return DEFAULT_LOCALE;
}

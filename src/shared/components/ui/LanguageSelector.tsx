"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import type { Locale } from "@/i18n";

const LOCALE_CONFIG: Record<Locale, { flag: string; label: string }> = {
  es: { flag: "🇲🇽", label: "ES" },
  en: { flag: "🇺🇸", label: "EN" },
};

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  const toggleLocale = () => {
    setLocale(locale === "es" ? "en" : "es");
  };

  const next = locale === "es" ? "en" : "es";
  const current = LOCALE_CONFIG[locale];
  const nextConfig = LOCALE_CONFIG[next];

  return (
    <button
      onClick={toggleLocale}
      aria-label={`Switch to ${nextConfig.label}`}
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 group"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(64,71,82,0.25)",
      }}
    >
      {/* Current locale display */}
      <span className="text-base leading-none select-none">{current.flag}</span>
      <span
        className="text-xs font-bold tracking-widest text-[#bfc7d4] group-hover:text-[#e5e2e1] transition-colors"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {current.label}
      </span>

      {/* Divider */}
      <span className="w-px h-3 bg-[#404752]/40 mx-0.5" />

      {/* Next locale hint */}
      <span className="text-xs font-medium tracking-widest text-[#404752] group-hover:text-[#89919d] transition-colors"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {nextConfig.label}
      </span>

      {/* Hover glow */}
      <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: "rgba(158,202,255,0.05)" }}
      />
    </button>
  );
}

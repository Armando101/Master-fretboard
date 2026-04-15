import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { resolveLocale, LANG_COOKIE_NAME } from "@/i18n";

export const metadata: Metadata = {
  title: "Guitar Atelier — Master Fretboard",
  description:
    "Precision fretboard training. Practice intervals, triads, inversions and scales in the digital atelier.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(LANG_COOKIE_NAME)?.value);

  return (
    <html lang={locale} className="dark h-full">
      <head>
        {/* Google Fonts — loaded via <link> to avoid CSS @import ordering issues */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <LanguageProvider initialLocale={locale}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

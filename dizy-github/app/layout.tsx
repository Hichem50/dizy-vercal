import type { Metadata } from "next";
import "./globals.css";
import { defaultLocale, dir } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Dizy — Marketplace numérique",
  description: "Vendez et achetez des produits numériques en Algérie.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={defaultLocale} dir={dir(defaultLocale)}>
      <body>{children}</body>
    </html>
  );
}

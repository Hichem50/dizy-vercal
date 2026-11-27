export type Locale = "fr" | "ar";
export const locales: Locale[] = ["fr", "ar"];
export const defaultLocale: Locale = "fr";
export const dir = (l: Locale) => (l === "ar" ? "rtl" : "ltr");

export const dict = {
  fr: {
    brand: "Dizy.",
    tagline: "MARKETPLACE NUMÉRIQUE",
    hero: "Vendez et achetez des produits numériques en Algérie",
    catalogue: "Catalogue",
    sell: "Espace vendeur",
    login: "Connexion",
  },
  ar: {
    brand: "Dizy.",
    tagline: "السوق الرقمي",
    hero: "بع واشترِ المنتجات الرقمية في الجزائر",
    catalogue: "الكتالوج",
    sell: "فضاء البائع",
    login: "تسجيل الدخول",
  },
} as const;

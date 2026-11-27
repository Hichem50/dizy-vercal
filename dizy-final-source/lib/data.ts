// Données d'exemple pour la vitrine (seront remplacées par les vraies données via l'API).
export type Cat = { key: string; fr: string; ar: string; color: string; icon: string };
export const CATS: Cat[] = [
  { key: "templates", fr: "Modèles", ar: "قوالب", color: "#F7931E", icon: "layers" },
  { key: "ebooks", fr: "E-books", ar: "كتب إلكترونية", color: "#1F2430", icon: "book" },
  { key: "icons", fr: "Icônes", ar: "أيقونات", color: "#0E7C66", icon: "star" },
  { key: "fonts", fr: "Polices", ar: "خطوط", color: "#2F6FED", icon: "font" },
  { key: "ui", fr: "Kits UI", ar: "حزم واجهات", color: "#C2410C", icon: "grid" },
  { key: "audio", fr: "Audio", ar: "صوتيات", color: "#7A4CC2", icon: "note" },
  { key: "courses", fr: "Cours", ar: "دورات", color: "#B4235A", icon: "play" },
];
export type Prod = { id: string; fr: string; ar: string; cat: number; price: number };
export const PRODUCTS: Prod[] = [
  { id: "p1", fr: "Pack d'icônes minimalistes", ar: "حزمة أيقونات بسيطة", cat: 2, price: 900 },
  { id: "p2", fr: "Modèle de CV moderne", ar: "قالب سيرة ذاتية عصري", cat: 0, price: 600 },
  { id: "p3", fr: "Guide : lancer sa boutique", ar: "دليل: إطلاق متجرك", cat: 1, price: 1200 },
  { id: "p4", fr: "Police arabe pour titres", ar: "خط عربي للعناوين", cat: 3, price: 1500 },
  { id: "p5", fr: "Kit UI boutique en ligne", ar: "حزمة واجهات متجر إلكتروني", cat: 4, price: 2500 },
  { id: "p6", fr: "Cours : Canva pour débutants", ar: "دورة: Canva للمبتدئين", cat: 6, price: 3000 },
  { id: "p7", fr: "Pack de sons pour vidéos", ar: "حزمة مؤثرات صوتية للفيديو", cat: 5, price: 800 },
  { id: "p8", fr: "Modèles de posts Instagram", ar: "قوالب منشورات إنستغرام", cat: 0, price: 700 },
];
export const COVER: [string, string][] = [
  ["#F7931E", "#FFC77A"], ["#1F2430", "#4A5368"], ["#0E7C66", "#4CC3A6"],
  ["#2F6FED", "#8DB0FA"], ["#C2410C", "#FB923C"], ["#7A4CC2", "#B9A0EC"], ["#B4235A", "#EE7FA8"],
];

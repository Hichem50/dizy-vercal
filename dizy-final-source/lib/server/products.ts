// Helpers serveur pour les produits (lecture via API, jamais depuis le navigateur).
import { CATS } from "@/lib/data";

// Champs renvoyés par l'API produit (avec boutique + catégorie).
export const PRODUCT_SELECT =
  "id,title,price,description,status,created_at,stores(name,slug),categories(slug)";

export type ApiProduct = {
  id: string;
  title: string;
  price: number;
  description: string | null;
  status: string;
  catKey: string | null;
  storeName: string | null;
  storeSlug: string | null;
};

export function toApiProduct(row: any): ApiProduct {
  const store = Array.isArray(row.stores) ? row.stores[0] : row.stores;
  const cat = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  return {
    id: row.id,
    title: row.title,
    price: row.price,
    description: row.description ?? null,
    status: row.status,
    catKey: cat?.slug ?? null,
    storeName: store?.name ?? null,
    storeSlug: store?.slug ?? null,
  };
}

// Insère les 7 catégories de base si elles n'existent pas (idempotent).
export async function ensureCategories(admin: any) {
  const rows = CATS.map((c) => ({ name_fr: c.fr, name_ar: c.ar, slug: c.key }));
  await admin.from("categories").upsert(rows, { onConflict: "slug" });
}

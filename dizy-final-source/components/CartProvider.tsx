"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Ctx = { items: string[]; add: (id: string) => void; remove: (i: number) => void; clear: () => void };
const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("dizy-cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("dizy-cart", JSON.stringify(items)); } catch {}
  }, [items]);

  const add = (id: string) => setItems((x) => (x.includes(id) ? x : [...x, id]));
  const remove = (i: number) => setItems((x) => x.filter((_, k) => k !== i));
  const clear = () => setItems([]);

  return <CartCtx.Provider value={{ items, add, remove, clear }}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}

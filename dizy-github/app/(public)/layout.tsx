import { LangProvider } from "@/components/LangProvider";
import { CartProvider } from "@/components/CartProvider";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <CartProvider>
        <PublicHeader />
        <main className="wrap pm">{children}</main>
        <PublicFooter />
      </CartProvider>
    </LangProvider>
  );
}

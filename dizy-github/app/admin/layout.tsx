import { LangProvider } from "@/components/LangProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <LangProvider>{children}</LangProvider>;
}

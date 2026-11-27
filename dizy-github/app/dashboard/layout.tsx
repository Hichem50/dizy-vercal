import { LangProvider } from "@/components/LangProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <LangProvider>{children}</LangProvider>;
}

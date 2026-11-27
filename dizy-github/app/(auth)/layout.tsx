import { LangProvider } from "@/components/LangProvider";
import { AuthBar } from "@/components/AuthBar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <AuthBar />
      <main className="auth-wrap">{children}</main>
    </LangProvider>
  );
}

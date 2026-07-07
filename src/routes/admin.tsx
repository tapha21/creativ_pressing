import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearAuthSession, getAuthSession, isPlatformAdmin } from "@/services/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administration - Creativ Pressing" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const nav = useNavigate();
  const [session, setSession] = useState(() => getAuthSession());

  useEffect(() => {
    const current = getAuthSession();
    if (!current || !isPlatformAdmin(current)) {
      nav({ to: "/login" });
      return;
    }
    setSession(current);
  }, [nav]);

  if (!session || !isPlatformAdmin(session)) {
    return null;
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-slate-50/50 text-slate-900 antialiased">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-background px-4 shadow-sm sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-black leading-tight text-slate-900">Console Administrateur</div>
            <div className="text-[11px] font-semibold text-muted-foreground">{session.userName}</div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-slate-600 hover:bg-slate-100"
          onClick={() => {
            clearAuthSession();
            nav({ to: "/login" });
          }}
          aria-label="Se deconnecter"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

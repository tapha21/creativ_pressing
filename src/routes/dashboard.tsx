import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Command, LogOut, Menu, Search, X } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearAuthSession, getAuthSession } from "@/services/auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — Creativ Pressing" }] }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(() => getAuthSession());

  useEffect(() => {
    const currentSession = getAuthSession();
    if (!currentSession) {
      nav({ to: "/login" });
      return;
    }
    setSession(currentSession);
  }, [nav]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-dvh min-h-dvh w-full overflow-hidden bg-slate-50/50 text-slate-900 antialiased">
      <aside className="hidden border-r border-slate-200/80 bg-card lg:block">
        <DashboardSidebar />
      </aside>

      <div className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div className={`absolute inset-y-0 left-0 w-[min(18rem,85vw)] transform bg-card shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <DashboardSidebar onNavigate={() => setOpen(false)} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-background px-3 shadow-sm shadow-slate-100/40 sm:px-4 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4 lg:max-w-xl">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="relative hidden w-full group sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary" />
              <Input
                placeholder="Rechercher une commande, un client..."
                className="h-10 w-full rounded-lg border-slate-200 bg-slate-50 pl-9 pr-12 text-sm transition-all focus-visible:bg-background focus-visible:ring-primary/20"
              />
              <div className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-slate-200 bg-background px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shadow-sm md:flex">
                <Command className="h-2.5 w-2.5" />
                <span>K</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4 sm:pl-4">
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-background" />
            </Button>

            <div className="hidden h-6 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-semibold leading-tight text-slate-800">{session?.shopName ?? "Boutique"}</div>
                <div className="text-xs font-medium text-muted-foreground">{session?.userName ?? "Compte actif"}</div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-600/10">
                {(session?.shopName ?? "CP").slice(0, 2).toUpperCase()}
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
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-50/40 p-3 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

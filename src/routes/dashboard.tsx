import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Menu, Search, X } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — Creativ Pressing" }] }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted/30">
      <div className="hidden lg:block"><DashboardSidebar /></div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0"><DashboardSidebar onNavigate={() => setOpen(false)} /></div>
        </div>
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-card px-4 lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </Button>
          <div className="relative hidden flex-1 max-w-md sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher…" className="pl-9 bg-muted/40 border-transparent" />
          </div>
          <div className="flex-1 sm:hidden" />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <div className="text-xs font-semibold">Ousmane Diop</div>
              <div className="text-[10px] text-muted-foreground">Propriétaire</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>OD</div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, LogOut, Menu, Settings, ShoppingBag, Users, Wallet, LayoutDashboard, X } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { canAccessFeature, clearAuthSession, getAuthSession, isSubscriptionUsable } from "@/services/auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — Creativ Pressing" }] }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const nav = useNavigate();
  const path = useRouterState({ select: (state) => state.location.pathname });
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

  if (session && !isSubscriptionUsable(session)) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">Abonnement expire</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Votre periode d'essai ou votre abonnement mensuel est termine. L'acces sera reactive quand le super admin mettra votre abonnement a jour.
          </p>
          <div className="mt-5 rounded-lg border bg-slate-50 p-3 text-left text-xs font-medium text-slate-600">
            <div>Boutique : {session.shopName}</div>
            <div>Offre : {session.subscriptionPlan}</div>
            <div>Etat : {session.subscriptionStatus}</div>
          </div>
          <Button
            className="mt-5 w-full"
            onClick={() => {
              clearAuthSession();
              nav({ to: "/login" });
            }}
          >
            Retour connexion
          </Button>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const feature = getFeatureFromPath(path);
  const canAccessCurrentPage = !session || canAccessFeature(session, feature);

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
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-background px-3 shadow-sm shadow-slate-100/40 sm:h-16 sm:px-4 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="min-w-0">
              <div className="truncate text-sm font-black leading-tight text-slate-900 sm:text-base">{session?.shopName ?? "Boutique"}</div>
              <div className="truncate text-[11px] font-semibold text-muted-foreground">{session?.subscriptionPlan ?? "Compte"}</div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4 sm:pl-4">
            <div className="flex items-center gap-3">
              {session?.logoUrl ? (
                <img src={session.logoUrl} alt={session.shopName} className="h-9 w-9 rounded-xl object-cover shadow-md" />
              ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-600/10">
                {(session?.shopName ?? "CP").slice(0, 2).toUpperCase()}
              </div>
              )}
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
          <div className="mx-auto max-w-7xl space-y-6 pb-20 lg:pb-0">
            {canAccessCurrentPage ? <Outlet /> : <LockedFeature sessionPlan={session?.subscriptionPlan ?? "Basic"} />}
          </div>
        </main>
        <MobileBottomNav session={session} path={path} />
      </div>
    </div>
  );
}

const mobileItems = [
  { to: "/dashboard", label: "Accueil", icon: LayoutDashboard, feature: "dashboard" },
  { to: "/dashboard/clients", label: "Clients", icon: Users, feature: "clients" },
  { to: "/dashboard/orders", label: "Cmdes", icon: ShoppingBag, feature: "orders" },
  { to: "/dashboard/expenses", label: "Caisse", icon: Wallet, feature: "expenses" },
  { to: "/dashboard/settings", label: "Reglages", icon: Settings, feature: "settings" },
];

function MobileBottomNav({ session, path }: { session: ReturnType<typeof getAuthSession>; path: string }) {
  const visible = mobileItems.filter((item) => canAccessFeature(session, item.feature)).slice(0, 4);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md" style={{ gridTemplateColumns: `repeat(${visible.length}, minmax(0, 1fr))` }}>
        {visible.map((item) => {
          const active = item.to === "/dashboard" ? path === item.to : path.startsWith(item.to);
          return (
            <a
              key={item.to}
              href={item.to}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-bold transition-colors ${
                active ? "bg-blue-50 text-primary" : "text-slate-500"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

function getFeatureFromPath(path: string) {
  if (path.includes("/clients")) return "clients";
  if (path.includes("/orders")) return "orders";
  if (path.includes("/expenses")) return "expenses";
  if (path.includes("/employees")) return "employees";
  if (path.includes("/reports")) return "reports";
  if (path.includes("/gallery")) return "gallery";
  if (path.includes("/settings")) return "settings";
  return "dashboard";
}

function LockedFeature({ sessionPlan }: { sessionPlan: string }) {
  return (
    <Card className="mx-auto mt-12 max-w-md p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
        <Lock className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-black tracking-tight text-slate-900">Fonction verrouillee</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Cette page n'est pas incluse dans votre offre {sessionPlan}. Le super admin peut changer votre abonnement pour l'activer.
      </p>
    </Card>
  );
}

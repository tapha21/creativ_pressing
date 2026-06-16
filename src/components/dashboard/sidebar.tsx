import { Link, useRouterState } from "@tanstack/react-router";
import { FileText, Images, LayoutDashboard, LogOut, Settings, ShoppingBag, Sparkles, UserCog, Users, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { canAccessFeature, clearAuthSession, getAuthSession } from "@/services/auth";

type Item = { to: string; label: string; icon: typeof LayoutDashboard; feature: string; exact?: boolean };

const items: Item[] = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, feature: "dashboard", exact: true },
  { to: "/dashboard/clients", label: "Clients", icon: Users, feature: "clients" },
  { to: "/dashboard/orders", label: "Commandes", icon: ShoppingBag, feature: "orders" },
  { to: "/dashboard/expenses", label: "Depenses", icon: Wallet, feature: "expenses" },
  { to: "/dashboard/employees", label: "Employes", icon: UserCog, feature: "employees" },
  { to: "/dashboard/reports", label: "Rapports", icon: FileText, feature: "reports" },
  { to: "/dashboard/gallery", label: "Galerie", icon: Images, feature: "gallery" },
  { to: "/dashboard/settings", label: "Parametres", icon: Settings, feature: "settings" },
];

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const session = getAuthSession();
  const visibleItems = items.filter((item) => canAccessFeature(session, item.feature));

  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-r bg-card lg:w-64">
      <Link to="/" className="flex h-16 items-center gap-2 border-b px-4">
        {session?.logoUrl ? (
          <img src={session.logoUrl} alt={session.shopName} className="h-8 w-8 rounded-lg object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        <div className="min-w-0">
          <span className="block truncate text-sm font-bold">{session?.shopName ?? "Creativ Pressing"}</span>
          <span className="block truncate text-[11px] font-medium text-muted-foreground">{session?.subscriptionPlan ?? "Compte"}</span>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {visibleItems.map((item) => {
          const active = item.exact ? path === item.to : path === item.to || path.startsWith(`${item.to}/`);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <Link
          to="/login"
          onClick={() => clearAuthSession()}
          className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Deconnexion
        </Link>
      </div>
    </aside>
  );
}

import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, ShoppingBag, Wallet, UserCog, FileText, Images, Settings, Sparkles, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const items: Item[] = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/clients", label: "Clients", icon: Users },
  { to: "/dashboard/orders", label: "Commandes", icon: ShoppingBag },
  { to: "/dashboard/expenses", label: "Dépenses", icon: Wallet },
  { to: "/dashboard/employees", label: "Employés", icon: UserCog },
  { to: "/dashboard/reports", label: "Rapports", icon: FileText },
  { to: "/dashboard/gallery", label: "Galerie", icon: Images },
  { to: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r bg-card">
      <Link to="/" className="flex h-16 items-center gap-2 border-b px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-bold">Creativ Pressing</span>
      </Link>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((it) => {
          const active = it.exact ? path === it.to : path === it.to || path.startsWith(it.to + "/");
          return (
            <Link
              key={it.to}
              to={it.to as string}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Link to="/login" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
          <LogOut className="h-4 w-4" /> Déconnexion
        </Link>
      </div>
    </aside>
  );
}
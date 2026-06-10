import { Link, useRouterState } from "@tanstack/react-router";
import { FileText, Images, LayoutDashboard, LogOut, Settings, ShoppingBag, Sparkles, UserCog, Users, Wallet } from "lucide-react";
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
  const path = useRouterState({ select: (state) => state.location.pathname });

  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-r bg-card lg:w-64">
      <Link to="/" className="flex h-16 items-center gap-2 border-b px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-bold">Creativ Pressing</span>
      </Link>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = item.exact ? path === item.to : path === item.to || path.startsWith(`${item.to}/`);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
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

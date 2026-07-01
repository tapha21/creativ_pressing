import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Crown, Layers, Sparkles, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createDemoSession } from "@/services/demo-data";
import { saveAuthSession } from "@/services/auth";
import type { AuthSession } from "@/services/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/demo")({
  head: () => ({ meta: [{ title: "Choisir une démo - Creativ Pressing" }] }),
  component: DemoPage,
});

const demoPlans = [
  {
    plan: "Basic" as const,
    icon: Layers,
    title: "Basic",
    description: "Clients, commandes et réglages essentiels.",
    tone: "border-blue-100 bg-blue-50/70 text-blue-700 hover:border-blue-200 hover:bg-blue-50",
  },
  {
    plan: "Standard" as const,
    icon: Wallet,
    title: "Standard",
    description: "Ajoute dépenses et gestion d'équipe.",
    tone: "border-emerald-100 bg-emerald-50/70 text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50",
  },
  {
    plan: "Premium" as const,
    icon: Crown,
    title: "Premium",
    description: "Vue complète avec rapports avancés.",
    tone: "border-amber-100 bg-amber-50/70 text-amber-700 hover:border-amber-200 hover:bg-amber-50",
  },
];

function DemoPage() {
  const nav = useNavigate();

  const startDemo = (plan: AuthSession["subscriptionPlan"]) => {
    const session = createDemoSession(plan);
    saveAuthSession(session);
    toast.success(`Démo ${plan} lancée`);
    nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 antialiased sm:py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            Creativ Pressing
          </Link>
          <Button variant="outline" asChild>
            <Link to="/login">Connexion</Link>
          </Button>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Choisissez une démo</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Sélectionnez le type d'offre à tester. Vous arriverez directement dans la plateforme avec des données fictives.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {demoPlans.map((item) => (
            <button
              key={item.plan}
              type="button"
              onClick={() => startDemo(item.plan)}
              className={`group flex min-h-56 flex-col items-start justify-between rounded-lg border p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${item.tone}`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/85 shadow-sm transition-transform group-hover:scale-105">
                <item.icon className="h-5 w-5" />
              </span>
              <span className="space-y-2">
                <span className="block text-xl font-black text-slate-900">Démo {item.title}</span>
                <span className="block text-sm font-medium leading-relaxed text-slate-600">{item.description}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-bold">
                Ouvrir la démo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>

        <Card className="border-slate-200 p-4 text-sm leading-relaxed text-muted-foreground shadow-sm">
          Les données de démonstration restent dans votre navigateur. Vous pouvez revenir ici pour tester une autre offre.
        </Card>
      </div>
    </div>
  );
}

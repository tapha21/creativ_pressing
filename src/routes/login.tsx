import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Connexion — Creativ Pressing" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15"><Sparkles className="h-5 w-5" /></div>
          <span className="font-bold">Creativ Pressing</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold leading-tight">Pilotez votre pressing en toute confiance.</h2>
          <p className="mt-4 text-primary-foreground/85">Accédez à votre tableau de bord, vos clients et vos commandes en un clic.</p>
        </div>
        <div className="text-xs text-primary-foreground/70">© 2026 Creativ Pressing</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8">
          <Link to="/" className="mb-6 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}><Sparkles className="h-4 w-4 text-primary-foreground" /></div>
            <span className="font-bold">Creativ Pressing</span>
          </Link>
          <h1 className="text-2xl font-bold">Bon retour</h1>
          <p className="mt-1 text-sm text-muted-foreground">Connectez-vous à votre espace.</p>
          <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setLoading(true); setTimeout(() => nav({ to: "/dashboard" }), 600); }}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" required placeholder="vous@pressing.sn" className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pass">Mot de passe</Label>
              <div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="pass" type="password" required placeholder="••••••••" className="pl-9" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11">
              {loading ? "Connexion…" : <>Se connecter <ArrowRight className="ml-1 h-4 w-4" /></>}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte ? <Link to="/signup" className="font-medium text-primary hover:underline">Créer ma boutique</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
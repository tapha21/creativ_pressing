import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Créer ma boutique — Creativ Pressing" }] }),
  component: SignupPage,
});

function SignupPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const fields: [string, string, string, string?][] = [
    ["shop", "Nom du pressing", "text", "Pressing Le Lys"],
    ["owner", "Nom du propriétaire", "text", "Ousmane Diop"],
    ["phone", "Téléphone", "tel", "+221 77 000 00 00"],
    ["city", "Ville", "text", "Dakar"],
    ["address", "Adresse", "text", "Rue 10, Sacré-Cœur"],
    ["email", "Email", "email", "vous@pressing.sn"],
    ["pass", "Mot de passe", "password", "••••••••"],
  ];
  return (
    <div className="min-h-screen bg-muted/30 py-10">
      <div className="container mx-auto max-w-2xl px-4">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}><Sparkles className="h-5 w-5 text-primary-foreground" /></div>
          <span className="font-bold">Creativ Pressing</span>
        </Link>
        <Card className="p-8 md:p-10">
          <h1 className="text-2xl font-bold md:text-3xl">Créer ma boutique</h1>
          <p className="mt-1 text-sm text-muted-foreground">Quelques informations et votre pressing est en ligne.</p>
          <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); setLoading(true); setTimeout(() => nav({ to: "/dashboard" }), 700); }}>
            {fields.map(([id, label, type, ph]) => (
              <div key={id} className={`space-y-2 ${id === "address" || id === "email" || id === "pass" ? "sm:col-span-2" : ""}`}>
                <Label htmlFor={id}>{label}</Label>
                <Input id={id} type={type} required placeholder={ph} />
              </div>
            ))}
            <Button type="submit" disabled={loading} className="sm:col-span-2 h-11" style={{ boxShadow: "var(--shadow-elegant)" }}>
              {loading ? "Création…" : <>Créer ma boutique <ArrowRight className="ml-1 h-4 w-4" /></>}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Déjà inscrit ? <Link to="/login" className="font-medium text-primary hover:underline">Se connecter</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
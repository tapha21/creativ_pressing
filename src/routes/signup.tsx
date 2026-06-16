import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Sparkles, ArrowRight, Loader2, Store, User, Phone, MapPin, 
  Mail, Lock, Eye, EyeOff, Building2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { pressingApi } from "@/services/pressing-api";
import { saveAuthSession } from "@/services/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Créer ma boutique — Creativ Pressing" }] }),
  component: SignupPage,
});

function SignupPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);

    try {
      const session = await pressingApi.auth.signup({
        shopName: String(formData.get("shop")),
        ownerName: String(formData.get("owner")),
        phone: String(formData.get("phone")),
        city: String(formData.get("city")),
        address: String(formData.get("address")),
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      });
      saveAuthSession(session);
      toast.success(`Boutique ${session.shopName} creee`);
      nav({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Creation impossible");
    } finally {
      setLoading(false);
    }
  };

  // Configuration enrichie des champs avec icônes
  const fields = [
    { id: "shop", label: "Nom du pressing", type: "text", ph: "Ex: Pressing Le Lys", icon: Store, section: "boutique" },
    { id: "owner", label: "Nom du propriétaire", type: "text", ph: "Ex: Nom du gérant", icon: User, section: "boutique" },
    { id: "phone", label: "Téléphone", type: "tel", ph: "+221 77 000 00 00", icon: Phone, section: "boutique" },
    { id: "city", label: "Ville", type: "text", ph: "Ex: Dakar", icon: Building2, section: "boutique" },
    { id: "address", label: "Adresse complète", type: "text", ph: "Ex: Rue 10, Sacré-Cœur", icon: MapPin, section: "boutique", fullWidth: true },
    { id: "email", label: "Adresse Email", type: "email", ph: "vous@pressing.sn", icon: Mail, section: "compte", fullWidth: true },
    { id: "pass", label: "Mot de passe", type: "password", ph: "••••••••", icon: Lock, section: "compte", fullWidth: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 flex flex-col justify-center antialiased">
      <div className="container mx-auto max-w-2xl px-4">
        
        {/* Logo de l'application */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:rotate-12 duration-300 shadow-md shadow-primary/10" style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}>
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-950 to-slate-800 bg-clip-text">Creativ Pressing</span>
          </Link>
        </div>

        {/* Carte principale */}
        <Card className="p-6 sm:p-10 border-slate-200/60 shadow-xl bg-background/90 backdrop-blur-sm transition-all duration-300">
          <div className="space-y-1 mb-8 text-center sm:text-left">
            <h1 className="text-2xl font-black md:text-3xl text-slate-900 tracking-tight">Créer ma boutique</h1>
            <p className="text-sm text-muted-foreground">Configurez votre espace de gestion en moins de 2 minutes.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* SECTION 1 : Informations sur le Pressing */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">1. Votre Pressing</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.filter(f => f.section === "boutique").map((f) => (
                  <div key={f.id} className={`space-y-1.5 ${f.fullWidth ? "sm:col-span-2" : ""}`}>
                    <Label htmlFor={f.id} className="text-slate-700 font-medium text-xs">{f.label}</Label>
                    <div className="relative group">
                      <f.icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                        id={f.id} 
                        name={f.id}
                        type={f.type} 
                        required 
                        placeholder={f.ph} 
                        className="pl-9 h-11 border-slate-200 focus-visible:ring-primary/20 transition-all text-sm bg-background"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2 : Identifiants de connexion */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">2. Vos identifiants de connexion</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.filter(f => f.section === "compte").map((f) => (
                  <div key={f.id} className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor={f.id} className="text-slate-700 font-medium text-xs">{f.label}</Label>
                    <div className="relative group">
                      <f.icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                        id={f.id} 
                        name={f.id === "pass" ? "password" : f.id}
                        type={f.id === "pass" && showPassword ? "text" : f.type} 
                        required 
                        placeholder={f.ph} 
                        className="pl-9 pr-10 h-11 border-slate-200 focus-visible:ring-primary/20 transition-all text-sm bg-background"
                      />
                      {f.id === "pass" && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-800 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton de soumission */}
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-11 text-sm font-semibold shadow-lg shadow-primary/20 group transition-all duration-200 pt-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initialisation de votre boutique...
                </>
              ) : (
                <>
                  Créer ma boutique gratuitement
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Lien vers connexion */}
          <div className="mt-8 text-center text-sm text-muted-foreground border-t border-slate-100 pt-6">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="font-semibold text-primary hover:text-indigo-600 transition-colors">
              Se connecter
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { pressingApi } from "@/services/pressing-api";
import { saveAuthSession } from "@/services/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Connexion — Creativ Pressing" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);

    try {
      const session = await pressingApi.auth.login({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      });
      saveAuthSession(session);
      toast.success(`Bienvenue ${session.userName}`);
      nav({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Connexion impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background antialiased">
      {/* Panneau gauche : Uniquement visible sur desktop */}
      <div 
        className="hidden lg:flex flex-col justify-between p-12 text-primary-foreground relative overflow-hidden" 
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)" }}
      >
        {/* Motifs de fond subtils pour casser le côté plat */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, white, transparent 40%), radial-gradient(circle at 80% 70%, white, transparent 50%)" }} />
        
        <Link to="/" className="flex items-center gap-2 group relative z-10 w-fit">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md transition-transform group-hover:rotate-12 duration-300">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">Creativ Pressing</span>
        </Link>

        <div className="relative z-10 max-w-md space-y-6">
          <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white text-balance">
            Pilotez votre pressing en toute confiance.
          </h2>
          <p className="text-indigo-100 text-base leading-relaxed opacity-90">
            Accédez à votre outil tout-en-un. Suivez vos revenus, pilotez votre personnel et gérez vos clients où que vous soyez au Sénégal.
          </p>

          {/* Petit élément de réassurance (Témoignage court) */}
          <div className="pt-6 border-t border-white/10 mt-8">
            <p className="text-sm italic text-indigo-200">"L'envoi automatique de SMS aux clients quand le linge est prêt a radicalement changé notre quotidien à la boutique."</p>
            <p className="text-xs font-semibold text-white mt-2">— Ousmane D., Gérant de Pressing à Dakar</p>
          </div>
        </div>

        <div className="text-xs text-indigo-200/60 relative z-10">
          © 2026 Creativ Pressing. Propulsé avec passion.
        </div>
      </div>

      {/* Panneau droit : Formulaire de connexion */}
      <div className="flex items-center justify-center p-4 sm:p-8 md:p-12 bg-slate-50/50">
        <Card className="w-full max-w-md p-6 sm:p-8 shadow-xl border-slate-200/60 bg-background/90 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          {/* Logo mobile */}
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden w-fit">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/20">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text">Creativ Pressing</span>
          </Link>

          <div className="space-y-1.5 mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bon retour !</h1>
            <p className="text-sm text-muted-foreground">Renseignez vos identifiants pour accéder à la caisse.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium text-xs">Adresse Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  required 
                  placeholder="nom@votrepressing.sn" 
                  className="pl-9 h-11 border-slate-200 focus-visible:ring-primary/20 transition-all text-sm" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pass" className="text-slate-700 font-medium text-xs">Mot de passe</Label>
                <Link to="#" className="text-xs text-primary font-medium hover:underline">Mot de passe oublié ?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="pass" 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••••" 
                  className="pl-9 pr-10 h-11 border-slate-200 focus-visible:ring-primary/20 transition-all text-sm" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-800 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-11 text-sm font-semibold shadow-lg shadow-primary/10 group transition-all duration-200 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vérification des accès...
                </>
              ) : (
                <>
                  Se connecter 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground border-t border-slate-100 pt-6">
            Nouveau sur la plateforme ?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:text-indigo-600 transition-colors">
              Créer ma boutique gratuitement
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
